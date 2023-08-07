import { type NextPage, type GetStaticProps } from 'next';
import { api } from '~/utils/api';

const UserProfile: NextPage<{ id: string }> = ({ id }) => {
  const user = api.users.getById.useQuery({ id });
  return (
    <div>
      {id} - {user.data?.name}
    </div>
  );
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context.params?.id;
  if (typeof id !== 'string') throw new Error('Invalid id');

  return {
    props: {
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};

export default UserProfile;
