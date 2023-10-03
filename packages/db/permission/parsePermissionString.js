export default function parsePermissionString (permissionString)  {
    const permissionArray = permissionString.split(":")
    const permValues = {}
    if (permissionArray.length >= 3) {
        permValues.type = permissionArray[0]
    } else {
        throw new Error("Invalid permission string")
    }

    // now loop through the array and see if we can find hex values
    permissionArray.map((perm, idx) => {
        // is it a hex value?
        const hexRegex = /[0-9a-fA-F]{24}/g;
        const hexMatches = perm.match(hexRegex);
        
        if (hexMatches && hexMatches.length > 0) {
            // we found a hex value
            const key = permissionArray[idx - 1]
            permValues[key] = perm
        } else {
            // if it start with a capital letter, its a model
            if (perm.charAt(0) === perm.charAt(0).toUpperCase()) {
                permValues.model = perm
            }
            // if it starts with a lowercase letter, its an action
            if(perm.charAt(0) === perm.charAt(0).toLowerCase()) {
                permValues.action = perm
            }
        }
    })

    // the permission id (pid) is always the last value
    permValues.pid = permissionArray[permissionArray.length - 1]

    return permValues
}