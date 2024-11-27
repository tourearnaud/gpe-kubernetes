import { useState, useCallback, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useArtcileById } from 'src/api/article';
import ProfileCover from '../profile-cover';
import ProfilePost from '../profiles-post';

const LieuProfileView = () => {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('post');
  const { articles } = useArtcileById(JSON.parse(localStorage.getItem('ArticleId')));

  useEffect(() => {
    console.log(articles);
  }, [articles]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* Breadcrumb */}
      {articles && articles.map((post, index) => (
        <CustomBreadcrumbs
          key={`breadcrumb-${index}`}
          links={[
            { name: 'Accueil', href: '/' },
            { name: user?.username || 'Utilisateur' }, // Utilise le nom de l'utilisateur
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      ))}

      {/* Profile Cover */}
      <Card sx={{ mb: 3, height: 340 }}>
        {articles && articles.map((post, index) => (
          <ProfileCover
            key={`profile-cover-${index}`}
            adresses={post?.adresses}
            codepostal={post?.codepostal?.toString() || ''}
            name={user?.username || 'Utilisateur'} // Nom de l'utilisateur
            userid={user?.id?.toString() || ''}
            avatarUrl={user?.avatar || `${process.env.REACT_APP_API_URL}/uploads/Profiles/default-avatar.png`}
            coverUrl={`${process.env.REACT_APP_API_URL}/resources/${post.imageName}`}

          />
        ))}
      </Card>

      {/* Posts Section */}
      {currentTab === 'post' && <ProfilePost />}
    </Container>
  );
};

export default LieuProfileView;
