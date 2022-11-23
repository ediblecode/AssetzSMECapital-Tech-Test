import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { Container } from "../components/Container/Container";
import { Table } from "../components/Table/Table";
import { Holding, Investor, Rate } from "../types";
import styles from "./index.module.css";

export interface HomeProps {
  investors: Investor[];
  holdings: Holding[];
  rates: Holding[];
}

export default function Home({ investors, holdings, rates }: HomeProps) {
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
              <th scope="col">Investor annual interest due</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((investor) => (
              <tr key={investor.id}>
                <th scope="row">{investor.name}</th>
              </tr>
            ))}
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
                <th scope="row">{rate.investmentAccount}</th>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apiResponses = await Promise.all([
    fetch("http://localhost:3000/api/investors"),
    fetch("http://localhost:3000/api/holdings"),
    fetch("http://localhost:3000/api/rates"),
  ]);

  if (apiResponses.some((r) => !r.ok))
    throw Error(`Error requesting data from the API`);

  const [investorsResponse, holdingsResponse, ratesResponse] = apiResponses;

  return {
    props: {
      investors: (await investorsResponse.json()) as Investor[],
      holdings: (await holdingsResponse.json()) as Holding[],
      rates: (await ratesResponse.json()) as Rate[],
    },
  };

  //const holdings = await fetch("http://localhost:3000");

  //if()
};
