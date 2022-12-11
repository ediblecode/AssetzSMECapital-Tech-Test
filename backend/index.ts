import { container } from "./config/ioc.config";
import { SERVICE_IDENTIFIER } from "./constants/identifiers";
import { type IApp } from "./interfaces";

import { printTable, Table } from "console-table-printer";

let app = container.get<IApp>(SERVICE_IDENTIFIER.APP);

app.getPortfolios().then((portfolios) => {
  const p = new Table({
    title: "Investor balances",
    columns: [
      {
        name: "investorId",
        title: "Investor ID",
        alignment: "left",
        color: "white_bold",
      },
      {
        name: "totalValue",
        title: "Value today",
        alignment: "right",
        color: "cyan",
      },
      {
        name: "totalDailyPortfolioValue",
        title: "Value tomorrow",
        alignment: "right",
        color: "magenta",
      },
      {
        name: "totalAnnualPortfolioValue",
        title: "Value in a year",
        color: "yellow",
        alignment: "right",
      },
    ],
  });

  p.addRows(portfolios);

  p.printTable();
});
