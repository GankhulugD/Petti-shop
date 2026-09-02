import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Буцаалт ба баталгаа" };

export default function ReturnsPage() {
  return (
    <LegalPage title="Буцаалт ба баталгаа">
      <p>
        Нээгээгүй, гэмтээгүй барааг хүлээн авснаас хойш <strong>7 хоног</strong>{" "}
        дотор буцааж болно. Хоол, элс зэрэг ариун цэврийн барааг нээсэн бол
        буцаахгүй.
      </p>
      <p>
        Гэмтэлтэй барааг зураг, захиалгын дугаартай илгээнэ үү. Баталгаат тохиолдолд
        солих эсвэл мөнгө буцаана.
      </p>
    </LegalPage>
  );
}
