export const GoogleButton = ({ onClick }: { onClick: () => void }) => (
  <div className='g-sign-in-button' onClick={onClick}>
    <div className='content-wrapper'>
      <div className='logo-wrapper'>
        <img
          alt='google-logo'
          src='https://developers.google.com/identity/images/g-logo.png'
        />
      </div>
      <span className='text-container'>
        <span>Sign in with Google</span>
      </span>
    </div>
  </div>
);
