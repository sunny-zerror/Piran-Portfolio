let printed = false;

export function zerrorSignature() {
  if (typeof window === "undefined" || printed) return;
  printed = true;

  console.clear();
  console.log("——————————————————————————————————")

  console.log(
    "%cDesigned by ZERROR STUDIOS",
    "font-size:16px;font-weight:bold;"
  );

  console.log(
    "%chttps://zerrorstudios.com",
    "font-size:14px;color:#002bba;"
  );

  console.log("——————————————————————————————————")

}