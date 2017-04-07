function Switch(to){
  switch (to) {
    case "Login":
        this.window.location.href=cwd;
    break;
    case "Register":
        this.window.location.href=cwd+"/register.html"
    break;
    case "ResetPassword":
        this.window.location.href=cwd+"/resetPassword.html"
    break;
    default:

  }
}
