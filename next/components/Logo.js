import { useRouter } from "next/router";

function Logo() {
  const router = useRouter();

  const backToHome = () => {
    router.push("/");
  };

  return (
    <div className="cursor-pointer" onClick={backToHome}>
      <img src="/logo.png" height={50} width={200} />
    </div>
  );
}

export default Logo;
