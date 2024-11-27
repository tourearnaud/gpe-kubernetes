import { Helmet } from 'react-helmet-async';

import { LieuProfileView } from 'src/sections/lieu/view';

// ----------------------------------------------------------------------

export default function LieuPage() {
  return (
    <>
      <Helmet>
        <title> Lieu </title>
      </Helmet>

      <LieuProfileView />
    </>
  );
}
