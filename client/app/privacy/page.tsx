import { LegalPage } from "@/components/layout/LegalPage";

export const metadata = { title: "Нууцлалын баталгаа" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Нууцлалын баталгаа">
      <p>
        Бид захиалга хүргэхэд шаардлагатай нэр, утас, хаяг, имэйлийг хадгална.
        Энэ мэдээллийг гуравдагч этгээдэд зарлахгүй, зөвхөн хүргэлт, нэхэмжлэлд
        ашиглана.
      </p>
      <p>
        Сагс, дуртай жагсаалт таны төхөөрөмжид хадгалагдана. Захиалгын бүртгэл
        манай серверт хадгалагдана.
      </p>
    </LegalPage>
  );
}
