import { useRef } from 'react';
import { _userFeeds } from 'src/_mock';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { useGetUserArticles } from 'src/api/article';
import { useGetUserById } from 'src/api/user';
import Iconify from 'src/components/iconify';
import ProfilePostItem from './profile-post-item';
import ProfileAPropos from './profile-apropros';

export default function ProfilePost() {
  const fileRef = useRef(null);
  const { user } = useGetUserById(JSON.parse(localStorage.getItem('UserId')));
  const { userArticles } = useGetUserArticles(JSON.parse(localStorage.getItem('UserId'))); 

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const renderCountPost = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {userArticles ? userArticles.length : 0}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Posts
          </Box>
        </Stack>

        <Stack width={1}>
          15
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Commentaires
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title="A propos" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>Ma passion le golf et voyager</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Vie à `}
            <Link variant="subtitle2" color="inherit">
              {/* {user[0].city} */}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {/* {user[0].email} */}
        </Stack>
      </Stack>
    </Card>
  );


  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderCountPost}
          {user && (
            <>
              {user.map((post) => (
                <ProfileAPropos key={post.id} user={post} />
              ))}
            </>
          )}
        </Stack>
      </Grid>
      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {userArticles && (
            <>
              {userArticles.map((post) => (
                <ProfilePostItem key={post.id} post={post} />
              ))}
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
