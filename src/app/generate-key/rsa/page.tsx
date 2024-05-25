import GenerateKeyForm from './components/GenerateKeyForm';
import { prisma } from '@/lib/prisma';

const getKaprodi = async () => {
  try {
    const result = await prisma.ketuaProgramStudi.findMany({
      select: {
        id: true,
        nama: true,
      },
      where: {
        nama: {
          not: "dummy",
        },
      }
    });

    const kaprodiDict = result.reduce((acc, curr) => {
      acc[curr.id] = curr.nama;
      return acc;
    }, {} as { [key: string]: string });

    return kaprodiDict;
  } catch (error) {
    console.error("Error getting data:", error);
  }
}

export default async function FormGenerateKey() {
  const data = await getKaprodi();
  if (!data) {
    return <div>Failed to fetch data</div>;
  }

  return (
    <div className="text-black dark:text-white">
      <GenerateKeyForm kaprodi={data} />
    </div>
  );
}