interface InsomniakProps {
    width?: string;
    height?: string;
}

const OurLogoWithoutRect = ({ width = '260', height = '260' }: InsomniakProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height} viewBox="0 0 612 612">
        <image id="Calque_0" data-name="Calque 0" x="132" y="132" width="348" height="348" xlinkHref="data:img/png;base64,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" />
        <image id="Calque_1" data-name="Calque 1" x="17" y="12" width="577" height="588" xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPUAAAD6CAYAAAB55wGwAAAgAElEQVR4nO2dB9gU1dXH/xQBKYJIESygIHasiPQigqIR7D2KBjVYYuJHFKMxsWBBsGE3hmLvqFERu6Cggkjs2LCi0pvSv+cm/0lujnfa7szuzrzn9zzv8+6Unbkzs2fuvadW23BIeyiZpDeAVgCqAagFoD6AHwGMLfBi2gEYDqA6l83/mgAuBvCG/kSyQ82qfgMyzJUA9nQ0/4MChfACAIc61j+pQp0tqufpYqoYP/pc7uUF3IYWAI722fZTVb/RWUOFOrv87NNyMyzvEvOqzg4Yta2rCjczT6hQZ5dVAS0fHuOqNgQwJGC7TtEyhgp1dgnqQbsD6BbxygZRyeZH7RTv0AAA+6R4/CqJCnXxNAbQCcCBAHoB2KpE57V70OUAXhPbr4x4nKHW52UApojtGxTYvjDqAngMwHMApgI4F0CzlM5VpdChVWGYH9/hAA4GsLP4MZph8UcAHgFwM4DvU2rDCuuz6U2v5wtmO67rxJfMiwHHMNfQ2lo2mu5nxZy8VsLt9jjA+tyRf7sAOCal81UZtKeOz1CajUZz6Ch7l1oU9IsAvMvhbRostI5pXs5vA7hUnOeqkPOeK5ZHApjjuJ40cGnbu9DurhSBCnV0WgJ4gYLSOOK3mgC4E8AVKbRnrVg2Zqm7ORT3MHbs/X2+vzeAPazluQDe8nlJJU1j0VN7bEGHGqUIVKij0RDAyxzO2hhBuAPAaQCOY0/5tuOIpkf8c8Jtktrvzfn/GrHe74Vyvlgezf91xfo05tRH+rwsqnEYHoWN9ffrRm9KNCYAaCv2vJjz18EAbmUveSGA3blujdj/rwD6JdgmKdSe8BkF2VJrfXsq8WzMtfxKHOtmfpbtTqOnDpo3R/VbfgrA+wB+D2AHADUSalvmUaEOx/QqPcReAzlnXuzz7Ts4P5SCNwZAvYTa5SfURoN9tdgme+thYtn4iy/g55U+x00Ko5jrah3LtHe+tdwpwnnacvqwLYBRAF5Nce6fOVSow/mT2GM4e+4w3nD4Um8K4JyE2rVaLNv2ZKPwWmIt72i1xczzjxXfvTbguEkLi1SQjadpy2PnCC8+eYyp6s76X1Sog2nPH5nH4pjeWk9yaG4zlF5cxeLXU4PKshFi+2X8P0i8ALxhrIc8btJCfZRYHk19hUcTmraCkEJ9Y8JtzDQq1MHIKKgXhXY5Cv/HIaZHfdqHiyVIqA3XiemBGar+1jF6kEPzNHvq3cSceT5fKF+L/YLm1Z0BbG8tz+WLSSEq1MG0EFtnF3CMZTRr2SRhuw4TvqUOgb1JaJdncT5qE/ayKIbjxXcf4v9PRIDK3gHnOFIs35dg+3KBCnUw0ryzMO4ByC1iuYdlgiqUKMJ3VUCIJnxcSeVxk9Iqm9/aEWLd3fz/FYAvrPW7+RyjpuMY9ybUvtygQh3MUrG1ZYHHMR5o71jL1Rw277hEmfuuo+nNxVyfXk6OABoU2U4P8yLbzFr+TIwSplmf24t9PXpT2ejxoSZw+CUq1MHMFVulrToO0gd71yLbFnXua+zP8xzrr/GJ9JLHbVhg+yRS4/6wWH5TLLvm1ceJ5Ycc+1R5VKiD+afYapQ0dQo81jSxvLPPflGJqqVeS5u6jZm//i3ieZJIklCLwS82d4tleX/2EssbMVQz6BhVHqhQhzIDwLfWThsVEf8rAyWKNWvFmfvebDmXGP4uHD6iHqdQDhL+8rPEdAQcStvTnQ5i+0Def49p/I4iUKEOZj2ASWKP3xR4LOl+WSzyeBsFHG893UIvoYlN9tw2Uo+QRHjur8XyOMc+y8T8uIN4wUitt+sYVR6oUEdivNhpQIGRRDL6aZnPfoUSNvd9jUElI0M04kvEcrGKsqbC5928YB7w2Xe69dncr5342SjH+lrbVjvm5EmS6TwDWRfqOtSSSntykjwP4EvreNViepV59BbLM4tsoxy+Ny/yeB7rxTx6gyJjnA8V8/2XacJyMVWs85x/DhOC9nyKySfOorVCPq/MkNU3Um86MuzLELz19EqawAwg3yR8viuFK6KJMrpNuDcGYQTjRLE96nf9+JTXu5pDcak9LpT5FKZ1/FvDl7+M346K1FgHOYu8K5Y9zzHpFnpXQtcqaclnXYcvjuvp+5/0qCpVslahozmjcoJC95YwVjhJf+Aa7K1tO/U8arCl2cvFOOFN9SVzmeU9/W5b4YX3M51u/JR0YC/ppWR6FMDpQlm5hMPxNAI4Xnd4s7WI+IwrhiwNv/diZo6wHFZGYXRCwudey0QINk3oPCG1tDZmPnq7wz3ynCqST1te95MhAg2RZKKVQ6k3ISWBPs8h0EdlTaCRIaE28beTHa6VM9kL2hkw73XEPyfBE47evy01ttfwpdOAARumB/8jTTdSW35XFXGaMPPwk8S6KBrr163PxkHnZLFdKi6TYFdHZRNj9rs/hXOlThaG39vSCcT2bTZvzzOFcBif4G2sEMO0eJQ2Uxffc36/qc/2BxymmTzTh/fqaMZIN3QkYZD0Yi44F3P5Yi90fu/Hx/zteJjp0dYpnKckZEGoZwnvqxlMz/NdGds0mnO9qKylOakQrXkeaEkrRRRlXj0qOl0mutF8mSeJ61l2ceRRzwyVPvw+Tgj0d3yTl1OgDWfQmUMmvpcsZGqj9lVYoEFFV1Tt/PIAc1/SWu8+DoG+IssCjQyYtGTc8UUO54hy8ST/ejNGeQcq6X6mxvc9eqO5gimUYN5w6EU+cPiHF4PRfdwjvj/Tkb8tc1SyUNdnZk4PYy99PMb323IYtTWPtZy9xRMJt/OFgDmgUhgykAYpKK3G0tvN5rA8PK9KF2o7AV01rgvyJGpFxcyh1Ji7PKHe4vA5ybe+kiwTmNttgKV0TDIiy/iiHyLWnU6HnsxTyYqyetRC2tE99zjicpsyCmggPcyiVGlcy+R27yXcZiVZGlBzvllIEEocWjLLim1NeZ7z61xQ6drvCRRYm4dZfK4u57P70VU0Lp/RXJZ09JRS2bzMUr8eyzhFCwpyyRSVLtQdHU7+UTA98UsAJlJ4W7Gwehvx3TM0vWyVYpjDCjEgpq6m4smCnXpohOqNHm+yF3+EDgU2G3O7Ldjmrd0zlVYrlcYuDlPZuBRcistOFqK0RtBMZBLoNRLb1tMZ5Wmal4KUX8ZmfIHIPunn+aXkjwfFFRnb+al5vNCshF7ewIdyEBVjq6lEmx4zF7cM7VufcDuVyuQ64QYKuhX/nMfnlaV46rmMYS4GmczOL1hfyQ99mPjAZngEb8DMUtXSGQ0Vy0+WqR1KaajvSMowy1H0MFdUJaEeZQXfgx5mY8vYHiVd6tL6sYk4SxJ1zCqavAh1k5CaT8NZnNxmSEB9aSX7NKAfgs3ZDqtI7siDUO9KX2EzR9pCbOvKt7V00h+jKWZzz/dMGeUVLXiFCrPck+lUqEzmdzuvY1MK9zPMXb09Azok9yRUdVKpfJYy88yLIqNKqdmSbszHMfjnvDTPn3Wh7i2uoWFIZpFrHcNwJf+UozxPPeYqP4KmWK+Cagd6ST6W1omzLtQm2uYHJvILYiYdT/5R3uYqVYCejAA7LCAf/cNMcphUWuf/IWspgv0ww+zBADpxXl2decBn0mklkwnklMywDQsAHhVQW1vyBef8iZNGTz2OGUBOTbGKgmQK/2owtK46Ux7JInKKkhSNGSF4OHPmBcmSF1Rk1wZ7Jq0nkbT2uxNzPQ+g0uqMhI8fxlp6ic1RgVZSoh/zzs3mXH2gj0D/RMeXDlTS2Qk75qSQQPE/JDn8bkCBklkgTcL7CxMoM6Mo5WJHzpGPYC66IGZQmB+g8O5MLzab7pSLVEhy+F2byeFklYNujG2+mcqqBT7fV5RKognnyYdwmB3EV8x9d4/wKa/JrCo2Y9IUaKSkKDuGaValIwg4x76QtmVFqTRacApp5sn9Q2p+L2LcvokfeMqnSMEtIrxzEXU+aZQN+g81NuiQVAXU/2Dm0ndyvi6dP+ozX7bJ3f0RNdSKUikcyXnyThFy3S3mb3mmTyWPDkyeaDMogRLGoaTlJmou+FwOxSc5tvdgwvTrRGJBRSkn97DXlczjb/VQK5dZcyrA/GIOZOGB50LK+CZG2r7f0+hVc5JP7PJZTFwgi6ApSjkww+IDAHzOcz9JV+Q2DAZ5RER5bc91EjPFbGetW0VHqZKQxvDbxUxWEazNOYtNA7rRdaOi7dtYR1aU5LmfPa2pZvqOmC/PYTne/lxux97aK+iwDT3GbBPW2aUs+FAqoQZTx0xkPrG2Dm+arekVtjF9Y3OZakbJBMtCHKfeoDOJ5z3WnUUiZlOg7d/2zFKPREsp1B7fMDnBHKYAbiC2782E/YtFAXJFqSRMTvp9KNxg2qQWLD5g05fxCSWjnPHUY6jeP4+ZPm22YBzsszF8aRWl1BzE3HmGZgD+IBowwqcuWKqk1VNXp5+rmWvUAlCHf3UZklafPXQt9sYf0lNHFixrQzvfZhy2ryv1DVKUAH5mrPahVmilxxf0CS85hXiUHc85QjV+v4b13/tck4Itt8v/ni3w2xC74GExi7wrSqmYQYXaZeJ8ZSsSEFeom3BYHJQPrBBahnxnIHN9K0qlUc8xj76X6ZPKQtw59XUpCHQY48p5gxQlhBvogeaxBMBp5bxpcXrqrvTrdrGSWUXmszdfx2qSa9jDrubntWJ5jc/n1TxGDVEmR1EqiR6OfHeDKdhlI45Qf0FTlN9cYRGjsEqqvleUMtHQkTf+WYZclpU4w++v6TJn3k6TxbbadAX9njm26+gvTck551o2anCEeWIlXHIhdupX6NL5Ozq6S4bR3fPYZJuqKBXFRFFgcRhTaJWdYuzU0+gfa4Yhu4ttjRhcvieA90uYq0xRSsUcZjQ5kjnIjqqUO1+s88kyZnx4iSVOZGKEdtQEbsgh+5rimqsoFcWH9Ne40YrsKjtJeZTNof16If25NxTbu3I4Pq8cbnOKkiIvVZJAIwXf7+sBtGeYpWQrDtcf5T6KosSnCQNJSibUYBTWSSyJM82xfSBjVC9RLbmiRMbERlzONGDPibLM/0OaUVovMoxyKG3YEmPTfo9+3Yqi/JLaDBZ5grJynpX+6xS/+1WqsjsmyurKADPX2Eqx8SlKBbA9terHM3mIHybacbncVqp46m9YxtPMBaY7tqsXmlLVqc5e+VGagS8KEGhjQrvULxS5HAXyqtEb53zGVL/LKgaKUhXZilFev6ZZOIinmH778aCoxXKUsl3PZP/3MwZ1TBnaoCjlZj8Orw8PiXz8jP7kY2kXD6Wc9ak/D4j6UpQ8sil/88c6vDBtvmFvPJG9c6xcAlkvOq8oWaArh9eH04U6jE+ZTWV2IdemQq0o6dCU5tpjKNRxMCmHP2al2Ls4VV0a9fvlSBGsKFWB7kzwsaXPtZryPaMBPMiYiWaOfVozY+kgKtR+iFLsohzab0WpCtSiw0hbca2vs/e9T5R1PpACHuZl+TKVZhP8ykKXM++3ouQZUz/rNl7fCgY8mWqvnQHc5BDIGkILvt7n3vSgWetjxlp0ljvo8FtR0uNLFoY8nb3zFz5nqsfkI3bucGO7vpaKte1EbS5w345M170PXwimxM96T6jP5Ya5TB6oKErxLGFduLBEhH+i3drDBDydyReCsVE/RLls5aM9b8Va2Sbl2Awzp64vNGvTWTv6GTbIOW5XFCURNmYaJLuYhanL9bzj4GaePoBxEv0d283LYFcj1IewUp8L83Z4kwL+ihasU5TEuZb5/jymRDSBtWc8xbGiGEZnI9Q3x0g+/iHr7L5EIdfcY4pSOC05765hHaELR8pRacBAkEE0o001Qt2GB+pJzVpQqJfNT8w79jJjp9/QHGSKEot7RcJCkze8XxG30OjF+ks7tXljdGIK4D78LPON+TGbQ4cX2IvP0eerKL7szGykNjswvXZRhDmfbM7sJf04zvdNoSL4mamMXqNT+nRmHlUU5d88I3rlB5gYoWjiepTtzi6+G3vxJhG/Z8b8j+jDVJR/sTc9y2xaJzW6jRvQMYN/pkL+JpyDd+V8fLeQ7ymK8m9Givtwe5LT1SR9v3dh792Hwu714rO4TVGUf3uK3WPdh7UM6EisZE+SoZfv8O8Wur11pZO69tKK8l+6i3txY9I1uDRKS1FKy5506ALNwlv6FJosGI3SUpTS8hZNv6A3WaICDRVqRSkLj/GkV6Rxck1npCil5346mYRFbxWECrWilJ6v+JcKOvxWlJyhQq0oOUOFWlFyhgq1ouQMFWpFyRkq1IqSM1SoFSVnqFArSs5QoVaUnKFCrSg5Q4VaUXKGCrWi5AwVakXJGSrUipIzVKgVJWeoUCtKzlChVpScoUKtKDlDhVpRcoYKtaLkDBVqRckZcYS6lWYfVZSyUIvyF4koQt2FZUI+Za7i4/W5KkrJOIly9ylrvu8ZduKwWlrNWGKzjli/N0+gKEp69ALwgjj6YgBtAMz3O2tYT93XIdCGX+uDVJTUOdpxgoYAegedOEyoV/msX6nPU1FSZ43PCfzk8l+ECfVEn9q5d+rzVJTUuc1xgi8BPB904hobdGgetN30yI+zhm4jKswG63xaUUrCXABTAWwBoDaA5wAcC+D7oJPHKTpfM2A4oChKukSWvzh2ahVoRSkfkeVPPcoUJWeoUCtKzlChVpScoUKtKDlDhVpRcoYKtaLkDBVqRckZKtSKkjNUqBUlZ6hQK0rOUKFWlJyhQq0oOUOFWlFyhgq1ouQMFWpFyRkq1IqSM1SoFSVnqFArSs5QoVaUnKFCrSjp0ZjVNEqKCrWipMcwAM+U+v6qUCtKevwKQFsA25byHqtQK0o6dLSE+felvMflEOpNWPirXxnOrSil4lzrPKagZINSnbhUReR3BdADwL4sg2sE+7NyKBEUpUS0s06zIYDTAIwoxanjlN2JQwsOP/Zh2c0dfL5ranR9lUYDFKXMnAngeqsJps5761I0KanhtzlOFwBDqe37HMCjAM4IEGjDUQmdX1EqjVsB/GC1qRWAw0vRxmKG36YSX08A3QB0j6nhM9UzXwLwShHnV5RKxtSQvgnAX6w2/gHAgwm3uRqA9f+zIsbw28wL9uC82AjxXgDqRvyuKb35IoAXAEwB8H7spitK9mjCcrQ1rJbvBmBmkVdSl72+6f2Hy+J5YT216X07A+hLQW4Z8aQr2Rt7gmw+Ly/8GhQlk8wDcDe13x5/BHBMARfTmDqqAdRTGb3VOFc1TL+e2syRHwNwILv3KHwKYDKF+FXOqxWlqrMTgH9a92A1O8d5Ee5Lcwpyf3asTcX2TV0F6P166nXs2oMEeiWF2PTGLwOYxgYrivJf3qWM9OKaDahA/ovPPTIC34feaGaq29Bnv0ddAo2QObVUyRtmA3ief68D+EYfnqKEYnraf1g7/cBe2MMonfcHcBCH1htGOKaxNr3m2hA0p57Mk5s3zVPUVs+QmjZFUUIx8vORZSFqBuAc2q5PomNWFKWzkcmnaTae4bdTmPZ7IwBL9JkpSiBGWP8K4OEAk9UptF3HYSWH7qaXn8QXQyhpeZQpSlXiCsvX+wMA4wHcJbwl6wD4DkCjkPsyn6Ni0xtPLMTjUoVaUYpjY1p6pEJrBYBHANzJ3hb0uLzKcbavqad6itajKJpxX1SoFaU4jIb62ZAjTAdwIx2vJjHmwWMwe/Wfk3oOGk+tKMXxCh2z7gjQP+3BHvtpx7a6SQo0KrSnbseXzYcV0BZFiUMLeosdx3DjKCwJsEUXRKX11Cbm9D3OLxQlaxhF2Ej6dx8A4D6XG6fAWJjuZ6hyItTYoEPzSrhvXTmvGMIXTQNGuUyugLYpSiHMponrXgCLAGxG/20XOwL4DSMe19LlumDvzHIPv40R/kK6zUnMG2534TerKFnFuIceyuCO/UOu4St2cndz5BqLcvbUJ/NN1stnu+mxP6E7qqJknXX0zjSCOgHAMgBb+eQua8heewg7tm/pfRaJcsypO1JjeAd7aj+Wca6hKHljJm3W2wE4kQFRfhxE7XlkSinUjWmrm8q3kETOIUZqwIiSc4zmeywzCHWlfCwUl2ziL/4W5zaUSqgHc+gxxLHNDLEvB/CTtW4xgCtL1DZFqQSmULfUjn7iU9mm++PGX6Qt1B1pnrqNNjzJLQC2Ydz2Rta2K4SQK0pVwbiI3g6gE4CBAG6Ie91pab83ZhD4WT7bTXqjC+he14KKAI9FXJeol42iVBXS6KmNvW2Wj0AvYUbFvSx/WTlfGK4CrSiFk2SFDjPUvpSpWFyMoU36a2vbbsJmZ4Yeo/V5KkrhJCHUJj70IgBn+2w3ESrn+0SyyDA0nUsrSpEUK9T70/PF5f62lPPqUT7f7Sx6daO6v04fqKIUR7Fz6hU+Aj2O5Xb8BBrslW1+kZQ8gB763JWUOYRunZmjWKF+WaQ6ncHMiSeIubOku3BA+YGG9zDM995iupf99FetpERnujA/RHvx7+jSmQmSMGltQLdPYzz/v4jfmcwUpx4nM4jcj6Z8edjOKx9R0aZzcCVJmjKWX45AV7HAhUks+GQlW2jKEaXV08rZhAglPk8FcBlrWkvOCRniK0ocNqfA7hLynS/o6XVfAnWxEqccAR1yLn2hz36dOQK4xUegx/ukh1GUQmkdQaDB/Uz20LeZc+ykpLOXFEOphbqXyPDwKYXTpjFd46b4BH4YE1k/xqV+UJpmK1WEyexEbJZyfr3U5xb0oQPVx4w87FnuW1VqoZa99J/E8mAKqitpwiKGq+0ZIXujohTKOcy97WESA77BzCXnByQtaEbdkJlavsOevG05nkIp59R9mZzc4xMGc4BKs8sCTFXj+QKIndhcUQrgMEeljc2tUGAzUjyWAReuJAce6zlHN7/fJ0qlXCulUL8lgr13YfH5kQGBH8ZENkx7ZqUMPMuc3h6zHPPtlrRnGwHfO6SJRrn2AJVrb6d5OaUafu8nBPpZ3pAPfAR6GYtz76ECrZSJ34hikO1pr7b5lrEKJkyyA+tpLfNpbmv+pmcwHNlMMdukcWmlEmp7Lr2ec42nfeYcdzG74ogStU1RXHwJ4DyxfpQoQWvzFkvLbhDhbvamMrh7Gne+FEJ9gBi2mIQIWzv2m8Ue/XjeUEUpN1dR9+Nh5OXvPm3amzqj2lyexN/9BT7VKscEHKso0p5Tb8g32A4B+6xglNfVaTZEUQqkiyP/vJlHP2otSy+0+Sxv62nRzcvgQJphD6U2PbHk/ZK0hXp7KsP8GMd5yGdpNkJRimQ8S+l4LACwBTuk6uy4drO2d+A6F9uxksfitB5K2sPv2cKM5WHseL9i4EeaAr0lnQP6WuYzRYnLEJH8rzFHl2A2UFugjw0QaLBHT02gUQKhXiOCMFbQRLUr7XdpsScVcR9xbjORmvaZ1LZHUWYoisdSh0PUEHqQ2T24mYPfU+67VooKHQtZRX8Z5xVPpHy+g2kyaCuSQJgX2KZM7HAUXVRnp9wWJT94itzNeUW1WD3D4x/0AS87eSs6vyPzi0flEgB/Lm+TlQzRzkeT/SbNUxURjlkpVS+T4n6fYPY3OY9pKtYbt9QmGu2VO4yTx5EpPNf5HP1J+/JRlaTsrbT61MWwjaPY3ixq4PdiL95NxHKDc6ULKv/ylAiYofF4Vnc5M6V0RBc6/CjOqaSHkyehlokWllDD/qG1brLlzWNzSdwiZEpFcq1QXP3dJxa/WE4R3x9Ip6mKIE9CLesNvRfgmXYWPXpsLku3eUoJkNloG6SkjZ7I/GU2N4VEbJWMPAn1P+kU4NGGWnc/BonkiP3oUKBkl1dZAcamr09hxmI5RQRv1AdwfSXcuTwJ9Qrh6NKMkTZByLdtrkwBVZRrKNw2o1NIWLCQiRBsTmQ23bKSJ6EGh0A2JgNpvYD9l4vluuk1TSkhhwnzUjVH0oMkuEl4jy2qhEQeWRTqU+iR5mKyqMq/Cet7uahNB3ubH0t5IUpq/OBwBNk14LdQDCdb392H08CykjWhNo7ytzLLaFeffaR54Wz6gEuqizn1YvqkK/ngXsf06k80bybJLP4m/8IECGUna0LtvWkbcN40wLHPdD5QG5khEiwC0MPSgj/EeZKSH05gr23zYAq+/6cx2rAiyJJQt6Ym08Yv2sWknVltLe9P7bZkNbXgf2AtL6UyaMOeb1KRduYV9Cyz2ZI9a27JklDvKJbHsaaWix/pUGITVFHzGo3prhjuYETdRQyblV6CcXnJYWoaxOCiXJIloa4tlqeG7H+50ERuy1hXpbKpJYbHJyTQ2t85AjHu9anYmnmyJNSLxHJYJsY1TP5vE7WAXyH0ol+wCSp5huluRtJW3irF8+aNK8X19A9I9hcH6Qden6O93JGl0MvmzJ3seYl9HcEDrBoTsLew1m0v/MGLZSATPwRpVY3N9HGW630lwXPnlRkim8hvfZSdcRnKRAY2pgDjbXm6j1nqqb8XoXSbOx6QZL0jnVLnBNt0I3vkMDOJeREdQRv6nSJ5Q55pTRPjvjGvcaxYPs5nv7iMYI02m1uyVHs6Clkzacmgi6HC+O9CDn2Tcrp/MMCneB6AzwGsdWwbRH1ALudz9OAbzJfdB8wSawoynB7jGNL7q0uCgneksIxUc9izM03WhHo6e0cboy292Gf//R3aU7/qhXG4jq6IkvvoVdSWWSPb0mtNaun3oPdbUMBJVqnH4exAcX2j+VctwnV9y5RUNkcndD++4YvVZveAksqZI4uZT56i8mQza10PKkLMS2olbZvHsMRoDfH9Mx1hmnHYlz9OmxUU8uHsoVeyl15Ej6OxtKnvZ32nKa9hQuJ3qLwsZ553aYIEpyl92XOHPYMawrmohcO3v1CMK+fOIh99L/62vs3Y/f4FWc1RVo8aZj9XUT/u4NCwUKpTWWcr6FazOkMUF8FTHQqfnQLKowbRiEo/o4RbxXasZftcw/5SclDIy+pHRjQ9FbDPxlSG2kE25j5PS+g6jPZ7jpgGzeEIqyJyjRVKVqO0llziVVgAAAYsSURBVLO4t+wxg/jUUeAsLic5NO4nxvD5vZVeUjYyi0ZUOrJ20wwmW/yAtthRRVzfDrTfjuEQejQdN/wCaPyYGBIc05TZN4PSAC105Bg7ImY7gljG3GI2Rv9yd4LnKAtZDr1cy6H0wJAqIKAZqRuHycUg7dwvFJBZQxb+61Nge+Szq84h6xmMJS+EEfyhn8ARzem8x+1iHmsl7fU20xxD26tZEFFOkTxkdpqjIs7JozJJdAwL+UwzTR7iqSdwfmRyRD3Moex8epNNoo2zB0udFENPeqXZyCD5KLwttK+bF+jf7BeUUD2mptlj94AA/wU+64O4y9Gunhxd2BxLa8B2jmM9TVOmR0seI0nO5DB/Ou+BVMRmjrwkSVjHH9FhnKNuRc1z34ScFuCwlU4JKa/ixzzhvrpRgR5TQZFGZxWgWQ+y+a+MeSywZ7ZdMzuwYKIxTz0i9t2TaZwPEOvX8kVtI2Pgk2BPKvG+SOHYJSdvmU88llJ5lBR1aB6zSdILyW/4GUStgG2NYvpMd6Qpzo91BbQPjiG4Fzp7qFWLyqM+SzHJEEY5vTmY+ybJ90VcY8WRV6FOml049PNYUUSi+E2EOW5VgbZzW6jXOxRT0u89COlvLSnkpQOHUPez5vsXM4WzvPY/0/nEE9wpIitsQ2rXFR9UqKMh59JvF5H6aDsRcTafDhFxsYW6GqcftgtkG58kEpJu1Dl4/OiIaCp01PO+sAyYNh9uLT/Jeay0HhzGOe5OXL5DbJdaa8VChToaslDArCKO1VssfywUZ1GRc+rpTGZv88cIx5Jz6TscuoJCFGUeMhJKCuQnnM+OF+vbsTh7fzr12Eki+6WUpD8XqFBHY3Oxl1+RgCgcLPaR7pBRkXPqBvRhtnvVzpwv+7EPHTo8VtAFVtYcK8aZ5QGGwXp0dfhxr6UCTL6ENqQ9+7fCvl/Lx023ygMV6shI+3ahttLdRUghiijtK3vqRvwve7zzA45xtVgeRaWRPedfLYQyLt85HG5kiiGPEbRYzBXrb+ALar21LonkCblEhToan4i9XDbVKAwT+7zHQviFIHtqT/Ckc8tBLB4oGSg8xVZaQm6bw1YXOD2wuU8sB9WdmsQXn4w7byZepp0KcIqpEqhQR0MmVehVQG+9k2PIWIyjgxRqb9j9kUMz/3vH9y8Xy7cw6KSGiPdek4Av+QQx2tkhpCDhXCrvwu6PKswcqFBH43WRPngLR7L4MKTCaAGjyApFCrXtICIzo55gDc9BH2p7tLHSilWvI4b2qxLoqRc7phlREh+cEeIbr0LtQIU6GssdfsgjHVpxP250zKUvKNJBRmZPsQVvMoM8POrSHdJDZlodZZnoagqhTqKnBsvK2hwScbRzO73QXMrJ7RPINpo7VKijc6kYQjak8AQFZNSk55nMkGJMYjcX2R7pBipfENKhxPMHP0jMRVeIobgU6iTm1KCW3/bj3jKGQL5GV87nrHWvUlv+cQJtyxUq1NFZ4MhIuRkVO09wKLgN7ac7sWd8zxG/vc5xnEKQdlop1PeIqKjmTP0kgz2uFl5dNR1z6mK03/ZxHhDr4qRs/pEJKs7kfLs7lYKFOO7kmqwmSSgnxwekll1H4W8S0L7+RbiY2twv4ouN/fsxsc+wkMojS/hisussb8pkAd6c/WMOc5Pwje7C0Y3HIp6vkIARxQftqeMznq6Vbzu+WT1AoOewd0lCoOGY57qGyLeyZpgfI4VAg1FjcvidVLDDFGEebORwxlGKRIW6MCbTkWRIhKwnS+g8sZujGHoxSEWZ61kuYEpiF8t8sqRsJBRYSQy9bWSQx7AiAkYUB1Ul/3Ra3My/jowX3tvKqbWAeb6fSyBBgwtp0vLrTUf5JE240tFLI+IIoBjGsqSsxxKODMqdVy03qFAnwzT+xcmZVizSTdQv6OIzOn/YEVuLOfSOQpJx6YbZ1EmsomXgzYSPX+VRoc4uUqiDlE0jhFAPD5hry99EGj2o+m2niAp1dpHD7yDhm8Lh9la0Swe5X8rqoqp3yRgq1NlFOp+EKbTOi3ilQbnPlAygb+HsImOe1yd0JY3EclAuNKUC0Z46u5xKL7FaVsneJPiGZXfX8dgvVvUbnSkA/D+VF050J7gQ2wAAAABJRU5ErkJggg==" />
    </svg>

)

export default OurLogoWithoutRect