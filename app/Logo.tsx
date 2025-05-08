import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image src="/logo.png" alt="MindMeld" width={100} height={100} />
    </div>
  );
}
