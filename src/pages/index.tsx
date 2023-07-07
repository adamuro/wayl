import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { If } from '~/components/condition';
import { Player } from '~/components/player';
import { api } from '~/utils/api';
import { cn } from '~/utils/cn';
import { FeedSong } from './home/feed';
import { Header } from './home/header';

const Home: NextPage = () => {
  const [playing, setPlaying] = useState<FeedSong | null>(null);
  const [play, setPlay] = useState(false);
  const feed = api.songs.getCurrentUserFeed.useQuery();
  const userSong = api.songs.getForCurrentUserAndTheme.useQuery();

  const headerSectionClassName = useMemo(
    () =>
      cn(
        'sticky top-0 z-50 p-4',
        userSong.data
          ? 'border-b border-neutral-700 bg-black'
          : 'bg-gradient-to-b from-black from-40% to-transparent',
      ),
    [userSong.data],
  );

  const handlePlaySong = (song: FeedSong) => {
    setPlaying(song);
    setPlay(true);
  };

  return (
    <>
      <section className={headerSectionClassName}>
        <Header />
      </section>
      <section className="h-full">
        <ul className={userSong.data ? '' : 'pointer-events-none select-none blur-sm'}>
          {userSong.data ? (
            <FeedSong
              key={userSong.data.id}
              song={userSong.data}
              isPlaying={play && userSong.data.id === playing?.id}
              onPlay={() => (userSong.data ? handlePlaySong(userSong?.data) : null)}
              onPause={() => setPlay(false)}
            />
          ) : null}
          {feed.data?.map((song) => (
            <FeedSong
              key={song.id}
              song={song}
              isPlaying={play && song.id === playing?.id}
              onPlay={() => handlePlaySong(song)}
              onPause={() => setPlay(false)}
            />
          ))}
        </ul>
      </section>
      <If cond={userSong.data}>
        <section className="sticky bottom-0 z-50 flex border-t border-neutral-700 bg-black">
          <Player
            play={play}
            onPlay={() => setPlay(true)}
            onPause={() => setPlay(false)}
            uri={playing?.uri}
          />
        </section>
      </If>
    </>
  );
};

export default Home;
