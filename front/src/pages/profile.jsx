import { Helmet } from 'react-helmet-async';

import { UserProfileView } from 'src/sections/profile/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Profil </title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
