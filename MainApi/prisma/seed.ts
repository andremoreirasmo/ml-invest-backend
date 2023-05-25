import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.stock.createMany({
    data: [
      {
        id: 1,
        name: 'Petróleo Brasileiro S.A',
        future_price: 0,
        image:
          'https://s3-symbol-logo.tradingview.com/brasileiro-petrobras--big.svg',
        ticker: 'PETR4.SA',
      },
      {
        id: 3,
        name: 'Vale S.A.',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/vale--big.svg',
        ticker: 'VALE3.SA',
      },
      {
        id: 4,
        name: 'Banco do Brasil S.A.',
        future_price: 0,
        image:
          'https://s3-symbol-logo.tradingview.com/banco-do-brasil--big.svg',
        ticker: 'BBAS3.SA',
      },
      {
        id: 5,
        name: 'Magazine Luiza S.A.',
        future_price: 0,
        image:
          'https://s3-symbol-logo.tradingview.com/magaz-luiza-on-nm--big.svg',
        ticker: 'MGLU3.SA',
      },
      {
        id: 6,
        name: 'Gerdau S.A.',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/gerdau--big.svg',
        ticker: 'GGBR4.SA',
      },
      {
        id: 7,
        name: 'Telefônica Brasil S.A.',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/telefonica--big.svg',
        ticker: 'VIVT3.SA',
      },
      {
        id: 8,
        name: 'Transmissora Aliança de Energia Elétrica S.A.',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/taesa--big.svg',
        ticker: 'TAEE11.SA',
      },
      {
        id: 9,
        name: 'Eletrobrás',
        future_price: 0,
        image:
          'https://s3-symbol-logo.tradingview.com/centrais-eletr-bras-sa--big.svg',
        ticker: 'ELET5.SA',
      },
      {
        id: 10,
        name: 'Sendas Distribuidora S.A.',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/assai-on-nm--big.svg',
        ticker: 'ASAI3.SA',
      },
      {
        id: 11,
        name: 'Pão de açucar',
        future_price: 0,
        image:
          'https://s3-symbol-logo.tradingview.com/cia-brasileira-distr-pao-de-acucar--big.svg',
        ticker: 'PCAR3.SA',
      },
      {
        id: 15,
        name: 'WEG S.A.',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/weg--big.svg',
        ticker: 'WEGE3.SA',
      },
      {
        id: 12,
        name: 'Itaú Unibanco',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/itau-unibanco--big.svg',
        ticker: 'ITUB4.SA',
      },
      {
        id: 16,
        name: 'TOTVS',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/totvs--big.svg',
        ticker: 'TOTS3.SA',
      },
      {
        id: 14,
        name: 'Oi',
        future_price: 0,
        image: 'https://s3-symbol-logo.tradingview.com/oi--big.svg',
        ticker: 'OIBR3.SA',
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
