import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { Container } from "../components/Container/Container";
import { Table } from "../components/Table/Table";
import { Investor, InvestorHolding, Rate, Rates } from "../types";
import { displayCurrecy as displayCurrency } from "../utils/number";
import styles from "./index.page.module.css";

export interface HomeProps {
  investorHoldings: InvestorHolding[];
  rates: Rates;
}

export default function Home({
  investorHoldings,
  rates: { bankOfEnglandRate, rates },
}: HomeProps) {
  return (
    <>
      <Head>
        <title>Assetz Capital Technical Challenge</title>
      </Head>

      <Container>
        <Table caption="Investors and their accounts with associated interest">
          <thead>
            <tr>
              <th scope="col">Investor</th>
              <th scope="col">Investor total</th>
              {rates.map((rate) => (
                <th key={rate.id} scope="col">
                  {rate.investmentAccount} ({rate.annualRate}%)
                </th>
              ))}
              <th scope="col">Investor annual interest due</th>
            </tr>
          </thead>
          <tbody>
            {investorHoldings.map(
              ({ investor, totalHolding, holdings, annualInterest }) => (
                <tr key={investor.id}>
                  <th scope="row">{investor.name}</th>
                  <td>£{displayCurrency(totalHolding)}</td>
                  {rates.map((rate) => {
                    const holding = holdings.find(
                      (holding) =>
                        holding.investmentAccount === rate.investmentAccount
                    );

                    return (
                      <td key={rate.id}>
                        {holding ? (
                          <>£{displayCurrency(holding.balance)}</>
                        ) : (
                          "-"
                        )}
                      </td>
                    );
                  })}
                  <td>£{displayCurrency(annualInterest)}</td>
                </tr>
              )
            )}
          </tbody>
        </Table>

        <Table caption="Investment accounts with their totals and annual interest due">
          <thead>
            <tr>
              <th scope="col">Investor</th>
              <th scope="col">Investor total</th>
              <th scope="col">Annual interest due</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate.id}>
                <th scope="row">
                  {rate.investmentAccount} ({displayCurrency(rate.annualRate)}%)
                </th>
                <td>£{displayCurrency(rate.investmentTotal)}</td>
                <td>£{displayCurrency(rate.annualInterest)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  query,
}) => {
  const { bankOfEnglandRate } = query;

  const apiResponses = await Promise.all([
    fetch(
      `http://localhost:3000/api/investorHoldings?bankOfEnglandRate=${bankOfEnglandRate}`
    ),
    fetch(
      `http://localhost:3000/api/rates?bankOfEnglandRate=${bankOfEnglandRate}`
    ),
  ]);

  if (apiResponses.some((r) => !r.ok))
    throw Error(`Error requesting data from the API`);

  const [investorHoldings, rates] = (await Promise.all(
    apiResponses.map((response) => response.json())
  )) as [InvestorHolding[], Rates];

  return {
    props: {
      investorHoldings,
      rates,
    },
  };
};
