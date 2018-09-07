var user=require("./user")
for (let index = 0; index < 20; index++) {
    user.addUser({
        name:"阿强"+index,
        password:Math.random().toString(36).substr(2)
    })
}
