import { prisma } from '@/lib/prisma';
import EncryptDecryptForm from './components/EncryptDecryptForm';

const getRc4Key = async () => {
  try {
    const result = await prisma.ketuaProgramStudi.findUnique({
      where: {
        id: 0,
      },
      select: {
        public_key: true,
      },
    });

    return result?.public_key;
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

export default async function FormGenerateKey() {
  const key = await getRc4Key();
  if (!key) {
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="text-black dark:text-white">
      <EncryptDecryptForm key={key}/>
    </div>
  );
}