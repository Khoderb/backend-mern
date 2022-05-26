import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
        {
            name:{
                type:String,
                required:true,
                trim:true,
            },
            email:{
                type:String,
                required:true,
                trim:true,
                unique:true
            },
            password:{
                type:String,
                required:true,
                trim:true,
            },
            token:{
                type:String,
            },
            confirmed:{
                type:Boolean,
                default:false,
            },  
        },
    { 
      timestamps:true,
    } 
);  

//código que hashea password antes de registrarlo en la DB

userSchema.pre("save", async function(next){
    //verifica que no se haya modificado el password antes
    if(!this.isModified("password")){
        next();
    } 
    const salt = await bcrypt.genSalt(10) //configura el hash
    this.password = await bcrypt.hash(this.password, salt) //genera hash y lo almacena en el password
}) 

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);

export default User;