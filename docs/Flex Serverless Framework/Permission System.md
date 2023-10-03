
#### Permission
Model Specific or custom action identifier

You can specify exactly what is allowed for each model

`org:$YOUR_ORG_ID:$YOUR_MODEL_NAME:$[SPECIFIC_IDadmin|read|write>]`

org:651b8ccd20745efcc28753e2:admin
org:651b8ccd20745efcc28753e2:User:651b8db5e0dd171354528d86:admin
#### Roles 

EntityBased
An entity is and Model or custom defined object in the entities.js file. This is where you'll import everything you want to permission in your application.

First, we define the all entities we want available
```javascript
// entities.js

import { UserSchema } from './schema/UserSchema'


export default {
	User: UserSchema
	createSurvey: CreateSurveyResolver
}
```

