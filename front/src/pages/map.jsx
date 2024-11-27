import { Helmet } from 'react-helmet-async';

import { MapView } from 'src/sections/map/view';

// ----------------------------------------------------------------------

export default function LieuPage() {
  return (
    <>
      <Helmet>
        <title> Lieu </title>
      </Helmet>

      <MapView />
    </>
  );
}
