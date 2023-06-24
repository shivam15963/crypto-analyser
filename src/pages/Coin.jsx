import { useEffect, useState } from "react";
import HistoryChart from "../components/HistoryChart"
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

function Coin() {
  const { coinId } = useParams();
  const [coin, setCoin] = useState({});
  const [loadCoin, setLoadCoin] = useState(true);

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error!");
        }
        const json = await response.json();
        setCoin(json);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [url]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // console.log(coin);

  const h24 = coin.market_data ? coin.market_data.price_change_24h : "";

  return (
    <>
    
      <section className="coin-page">
        <div className="container">
          <div onLoad={() => setLoadCoin(false)} className="coin-content">
            <div className="coin-content__img-side">
              {loadCoin && <span className="loader"></span>}
              {coin.image ? <img src={coin.image.large} alt={coin.id} /> : null}
              <h2>{coin.name}</h2>
              <p>Rank: #{coin.coingecko_rank}</p>
            </div>
            
            <div className="coin-content__text-side">
              <div className="numb">
                <div className="coin-content__text-side__24h">
                  <span>24h Change:</span>
                  <p className={h24 >= 0 ? "green-text" : "red-text"}>
                    {coin.market_data
                      ? coin.market_data.price_change_percentage_24h.toFixed(
                          3
                        ) + "%"
                      : ""}
                  </p>
                </div>

                

                <div className="coin-content__text-side__current">
                  <span>Price:</span>
                  <p className={"green-text"}>
                    {coin.market_data
                      ? "Rs." +
                        numberWithCommas(
                          coin.market_data.current_price.inr.toFixed(2)
                        )
                      : null}
                  </p>
                </div>
                <div className="coin-content__text-side__symbol">
                  <p>Symbol:</p>
                  <span>{coin.symbol}</span>
                </div>
              </div>
              
              {loadCoin && <span className="loader"></span>}
              <div className="description">
              
                <p
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      coin.description ? coin.description.en : ""
                    ),
                  }}
                ></p><br/>
                <p>Last Month Change Graph:</p><br/>
                <HistoryChart />
                
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Coin;
