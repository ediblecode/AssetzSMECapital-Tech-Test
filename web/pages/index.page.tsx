import type { GetServerSideProps } from "next";
import { stringify } from "querystring";

import serialize from "form-serialize";
import Head from "next/head";
import { useRouter } from "next/router";
import { createRef, useCallback } from "react";
import { Container } from "../components/Container/Container";
import { Table } from "../components/Table/Table";
import { InvestorHoldingResponse, Rates } from "../types";
import { displayCurrency as displayCurrency } from "../utils/number";
import styles from "./index.page.module.css";
import { Range } from "../components/Range/Range";

const apiBase = "http://localhost:3000/api/";

export interface HomeProps {
  investorHoldings: InvestorHoldingResponse;
  rates: Rates;
  sort: string;
}

export default function Home({
  investorHoldings: {
    investorHoldings,
    minimumRiskLevel,
    maximumRiskLevel,
    minimumHolding,
    maximumHolding,
  },
  rates: { bankOfEnglandRate, rates },
  sort,
}: HomeProps) {
  const router = useRouter(),
    formRef = createRef<HTMLFormElement>();

  const doClientSideFormSubmit = useCallback(() => {
    if (formRef.current) {
      router.push(
        {
          query: serialize(formRef.current),
        },
        undefined,
        { scroll: false }
      );
    }
  }, [formRef, router]);

  const formSubmitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      if (formRef.current) {
        e.preventDefault();
        doClientSideFormSubmit();
      }
    },
    [formRef, doClientSideFormSubmit]
  );

  return (
    <>
      <Head>
        <title>Assetz Capital Technical Challenge</title>
      </Head>

      <Container>
        <form ref={formRef} onSubmit={formSubmitHandler}>
          <div className={styles.sliders}>
            <Range
              title="Investor risk"
              name="investorRisk"
              min={0}
              max={1}
              onChange={doClientSideFormSubmit}
            />
            <Range
              title="Investor total"
              name="investorTotal"
              min={minimumHolding}
              max={maximumHolding}
              isCurrency
              onChange={doClientSideFormSubmit}
            />
          </div>
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

          <label className={styles.sort}>
            Sort
            <select value={sort} name="sort" onChange={doClientSideFormSubmit}>
              <option value="">Please select</option>
              <option value="totalAsc">Investor total (high to low)</option>
              <option value="totalDesc">Investor total (low to high)</option>
              <option value="nameAsc">Investor name (A to Z)</option>
              <option value="nameDesc">Investor name (Z to A)</option>
            </select>
          </label>

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
                    {rate.investmentAccount} ({displayCurrency(rate.annualRate)}
                    %)
                  </th>
                  <td>£{displayCurrency(rate.investmentTotal)}</td>
                  <td>£{displayCurrency(rate.annualInterest)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </form>
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  req,
  query,
}) => {
  const apiResponses = await Promise.all([
    fetch(`http://localhost:3000/api/investorHoldings?${stringify(query)}`),
    fetch(
      `http://localhost:3000/api/rates?bankOfEnglandRate=${query.bankOfEnglandRate}`
    ),
  ]);

  if (apiResponses.some((r) => !r.ok))
    throw Error(`Error requesting data from the API`);

  const [investorHoldings, rates] = (await Promise.all(
      apiResponses.map((response) => response.json())
    )) as [InvestorHoldingResponse, Rates],
    { sort } = query;

  return {
    props: {
      investorHoldings,
      rates,
      sort: (sort as string) || "",
    },
  };
};
