import puppeteer from "puppeteer";

export default async function searchProfanity({ email, password, postUrls }) {
  let comments;
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 600,
  });

  /* Inicio de sesion */

  await page.goto("https://www.facebook.com/");
  for (let postUrl of postUrls) {
    await page.waitForSelector("[name='email']");
    const context = browser.defaultBrowserContext();
    context.overridePermissions("https://www.facebook.com", [
      "geolocation",
      "notifications",
    ]);
    await page.type("[name='email']", email);
    await page.type("[type='password']", password);
    await page.waitForTimeout(1000);
    const login = await page.$("[name='login']");
    await login.click();
    await page.waitForNavigation();
    const emailInput = await page.$("[name='email']");
    /* Verificación si la cuenta accedio correctamente */
    if (emailInput) {
      console.log(`La cuenta ${email} fallo al iniciar sesion`);
      break;
    }
    await page.waitForSelector("input[type='search']");

    /* Entrar a la publicación */
    await page.goto(postUrl);
    await page.waitForSelector(".mdldhsdk.ii04i59q");
    await page.waitForTimeout(1000);

    //Verificar si hay demasiados comentarios
    const lotOfComments = await page.$(
      ".wkznzc2l.oygrvhab.dhix69tm > div > .oygrvhab.hcukyx3x.h3fqq6jp > .k77z8yql.l9j0dhe7.abiwlrkh.p8dawk7l.lzcic4wl"
    );
    console.log(lotOfComments);
    //-- Demaciados comentarios: Muestro todos los comentarios
    if (lotOfComments) {
      await lotOfComments.click();
      const showAllComments = await page.$$(
        ".j83agx80.cbu4d94t.buofh1pr.l9j0dhe7 > .dhp61c6y.l9j0dhe7.iyyx5f41.a8s20v7p > div"
      );
      await showAllComments[showAllComments.length - 1].click();
      await page.waitForSelector(".mdldhsdk.ii04i59q");
    }
    //Verificar si se han cargado todos los cometarios
    for (let i = 0; i < 1; i++) {
      const loadMoreComments = await page.$(
        ".wkznzc2l.oygrvhab.dhix69tm > .buofh1pr.jklb3kyz.l9j0dhe7 > .g5gj957u.p8fzw8mz.gpro0wi8"
      );
      if (loadMoreComments) {
        await loadMoreComments.click();
        i -= 1;
      }
    }

    //Verificar si hay subcomentarios (respuestas a comentarios)
    const thereIsSubComment = await page.$$(
      ".j83agx80.buofh1pr.jklb3kyz.l9j0dhe7 > .buofh1pr.g5gj957u.p8fzw8mz.gpro0wi8"
    );
    console.log(thereIsSubComment);
    //-- Hay subcomentarios: Muestro los subcomentarios
    if (thereIsSubComment) {
      for (let subComment of thereIsSubComment) {
        await subComment.click();
        await page.waitForTimeout(3000);
      }
    }
    //Por ultimo se optienen todos los comentarios existentes en el post
    comments = await page.$$eval(
      "ul > li .tw6a2znq.sj5x9vvc.d1544ag0.cxgpxx05 > .ecm0bbzt.e5nlhep0.a8c37x1j",
      (comments) => comments.map((comment) => comment.textContent)
    );
  }
  return comments;
}

//Verifico si se han cargado todos los comentarios en la publicación

//--No son todos los comentarios: Muestro lo cometarios que faltan

//--Son todos los comentarios: Termino el proceso y retorno la lista de comentarios
