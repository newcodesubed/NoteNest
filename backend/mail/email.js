import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL } from "./emailTemplates.js";
import { sender, transporter } from "./nodemailer.config.js";


export const sendVerificatonEmail = async (email, verificationToken)=>{

try {
    const response =await transporter.sendMail({
        from: sender,
        to: email,
        subject: "Verify your signup",
        html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });

    console.log("Message sent: %s", response.messageId);
} catch (error) {
    console.error("Error sending email:", error);
        throw new Error(`Failed to send verification email: ${error}`);
}

}

export const sendWelcomeEmail = async (email, name) => {
    
    
    try {
        const response =await transporter.sendMail({
        from: sender,
        to: email,
        subject: "Welcome Email",
        html: WELCOME_EMAIL.replace("{username}",name),
    });
  console.log("Welcome Email successfully",response)
    } catch (error) {
        console.error(`error sending welcome email`, error)
        throw new Error(`Error sending welcome email: ${error}`)
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
 
    try {
        const response =await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            
        });
        console.log("Password reset email sent successfully:", response);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error(`Failed to send password reset email: ${error}`);
    }
}


export const sendResetSuccessEmail = async (email) =>{
    try {
        const response = await transporter.sendMail({
            from: sender,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });
        console.log("Reset success email sent successfully:", response);
        
    } catch (error) {
        console.error("Error sending reset success email:", error);
        throw new Error(`Failed to send reset success email: ${error}`);
    }
}