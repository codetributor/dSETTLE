import { useRouter } from "next/router";

function Logo() {
  const router = useRouter();

  const backToHome = () => {
    router.push("/");
  };

  return (
    <div className="cursor-pointer" onClick={backToHome}>
      <h1 className="text-4xl text-blue-400 font-extrabold">wllo</h1>
    </div>
  );
}

export default Logo;
