
#### Permission
Model Specific or custom action identifier

You can specify exactly what is allowed for each model
CRUD is exactly what it sounds like
c = allow create
r = allow read
u = allow update
d = all delete

`org:$YOUR_ORG_ID:$YOUR_MODEL_NAME:$[SPECIFIC_ID]:[c|r|u|d]`

#### Examples
```
org:651b8ccd20745efcc28753e2:crud
```
This allows all access to everything that organization owns. This is an admin feature

```
org:651b8ccd20745efcc28753e2:User:651b8db5e0dd171354528d86:cru
```
This allows CRU create, read, and update (but not delete) permissions to a specific user.
```
org:651b8ccd20745efcc28753e2:User:crud
```
This allows all CRUD on this organizations Users.


#### Roles 

Roles are an array of permissions.
For example, you can define a role as BasicUser then assign the role to user. Any user with this role will have these permissions.


```json
{
	"name": "BasicUser",
	"permissions":["org:651b8ccd20745efcc28753e2:User:{USER_ID}:crud",
"org:651b8ccd20745efcc28753e2:User:r"] 
}
```
This user can do create, read, and update their user, but can only read other users.