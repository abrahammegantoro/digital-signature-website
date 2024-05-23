import { prisma } from '@/lib/prisma';
import EncryptDecryptForm from './components/EncryptDecryptForm';

// Get Database Here

export default async function FormGenerateKey() {
//   const data = await getKaprodi();
//   if (!data) {
//     return <div>Failed to fetch data</div>;
//   }

  return (
    <div className="text-black dark:text-white">
      <EncryptDecryptForm />
    </div>
  );
}