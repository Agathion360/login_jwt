class ProfileController {
    constructor() {}
  
    showProfile(req, res) {
      if (req.session && req.session.user) {
        res.render('profile', { user: req.session.user });
      } else {
        res.redirect('/');
      }
    }
  }
  
  export default ProfileController;
  