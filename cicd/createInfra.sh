#!/bin/bash

main(){
    export PULUMI_SKIP_UPDATE_CHECK=true
    curl -fsSL https://get.pulumi.com | sh
    pulumi version

    ENV_KEY_ID=$AWS_ACCESS_KEY_ID
    ENV_SECRET_KEY=$AWS_SECRET_ACCESS_KEY
    ENV_SESSION_TOKEN=$AWS_SESSION_TOKEN
    ENV_REGION=$AWS_REGION
    AWS_IAM_ROLE_ARN=$AWS_IAM_ROLE_ARN

    create_s3_deployment_bucket
    create_event_bus
    create_hosted_zone

    MASTER_KEYS=$(aws --output json sts assume-role --role-arn arn:aws:iam::$AWS_IAM_ROLE_ARN:role/subdomain_delegation --role-session-name github-ac-service)
    export AWS_ACCESS_KEY_ID=$(echo $MASTER_KEYS | jq -r '.Credentials.AccessKeyId')
    export AWS_SECRET_ACCESS_KEY=$(echo $MASTER_KEYS | jq -r '.Credentials.SecretAccessKey')
    export AWS_SESSION_TOKEN=$(echo $MASTER_KEYS | jq -r '.Credentials.SessionToken')
    export AWS_REGION="us-east-1"
    delegate_ns

    export AWS_ACCESS_KEY_ID=$ENV_KEY_ID
    export AWS_SECRET_ACCESS_KEY=$ENV_SECRET_KEY
    export AWS_SESSION_TOKEN=$ENV_SESSION_TOKEN
    create_api_cert

    export AWS_REGION=$ENV_REGION
    create_api_gateway

}
create_hosted_zone(){
    cd pulumi/aws-resources/route53/hosted-zone
    init_stack "$STAGE"
    pulumi up -y
    export hostedZoneNS=$(pulumi stack output hostedZoneNS)
    export hostedZoneId=$(pulumi stack output hostedZoneId)
    pulumi logout --all
    cd ../../../../
}
delegate_ns(){
    cd pulumi/aws-resources/route53/ns-delegation
    init_stack "$STAGE"
    pulumi config set --path 'zoneNS[0]' $(echo "$hostedZoneNS" |jq -r '.[0]')
    pulumi config set --path 'zoneNS[1]' $(echo "$hostedZoneNS" |jq -r '.[1]')
    pulumi config set --path 'zoneNS[2]' $(echo "$hostedZoneNS" |jq -r '.[2]')
    pulumi config set --path 'zoneNS[3]' $(echo "$hostedZoneNS" |jq -r '.[3]')
    pulumi up -y
    pulumi logout --all
    cd ../../../../
}
create_api_cert(){
    cd pulumi/aws-resources/acm/api-certificate
    init_stack "$STAGE"
    pulumi config set zoneId $hostedZoneId
    pulumi up -y
    export apiCertArn=$(pulumi stack output apiCertArn)
    pulumi logout --all
    cd ../../../../
}
create_api_gateway(){
    cd pulumi/aws-resources/apigateway/api-rest
    init_stack "$STAGE"
    pulumi config set zoneId $hostedZoneId
    pulumi config set apiCertArn $apiCertArn
    pulumi up -y
    export apiRestId=$(pulumi stack output apiRestId)
    export apiRootId=$(pulumi stack output apiRootId)
    pulumi logout --all
    cd ../base-path-mapping  ## Init base-path-mapping stack, without deploying it
    init_stack "$STAGE"
    pulumi config set apiRestId $apiRestId
    pulumi logout --all
    cd ../../../../
    yq e -i ".provider.apiGateway.restApiId=\"$apiRestId\"" serverless_core.yml
    yq e -i ".provider.apiGateway.restApiRootResourceId=\"$apiRootId\"" serverless_core.yml
}

create_s3_deployment_bucket(){
    cd pulumi/aws-resources/s3/deployment-bucket
    init_stack "$STAGE"
    pulumi up -y
    pulumi logout --all
    cd ../../../../
}

create_event_bus(){
    cd pulumi/aws-resources/event-bus/serverless
    init_stack "$STAGE"
    pulumi config set eventBusName $EVENT_BUS_NAME
    pulumi up -y
    pulumi logout --all
    cd ../../../../
}


init_stack(){

    stack_name="$1"
    login_url="s3://pulumi-state-workflows-$AWS_REGION/github/$AWS_REGION/${GITHUB_REPOSITORY#*\/}/${PWD#*\/aws-resources/}"

    npm install --no-audit > /dev/null
    pulumi login "$login_url"

    check_stack=$(pulumi stack ls -j |jq -r --arg env "$stack_name" 'select(.[].name | index($env))[0]')

    if [ -z "$check_stack" ]; then
      pulumi stack init $stack_name --non-interactive --secrets-provider="awskms://alias/pulumi_config?region=$AWS_REGION"
    else
      pulumi stack select $stack_name
      pulumi stack change-secrets-provider "awskms://alias/pulumi_config?region=$AWS_REGION"
    fi
    pulumi config set aws_region $AWS_REGION
    pulumi config set domainName $DOMAIN_NAME

}

main "$@"
