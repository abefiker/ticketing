import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Add Grow Plugin Script */}
          <script
            data-grow-initializer=""
            dangerouslySetInnerHTML={{
              __html: `
                !(function(){
                  window.growMe || ( (window.growMe = function(e) { window.growMe._.push(e); }),(window.growMe._=[]));
                  var e = document.createElement("script");
                  (e.type = "text/javascript"),
                  (e.src = "https://faves.grow.me/main.js"),
                  (e.defer = !0),
                  e.setAttribute("data-grow-faves-site-id", "U2l0ZToyZTE4NTQ1Mi02MTEyLTQ5NmQtYTRlOC00OWY4M2I4MmJjMWM=");
                  var t = document.getElementsByTagName("script")[0];
                  t.parentNode.insertBefore(e, t);
                })();
              `,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
