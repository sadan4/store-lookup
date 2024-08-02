/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import styles from "./page.module.css";
import DATA from "./data.json";
import { useMemo, useState } from "react";
import { LogoMap } from "./symbols";
//taken from vencord https://github.com/vendicated/vencord
/**
 * Returns a new function that will call the wrapped function
 * after the specified delay. If the function is called again
 * within the delay, the timer will be reset.
 * @param func The function to wrap
 * @param delay The delay in milliseconds
 */
function debounce<T extends Function>(func: T, delay = 300): T {
    let timeout: NodeJS.Timeout;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func(...args);
        }, delay);
    } as any;
}
interface IcardsOpen  {
    [key: string]: (s: boolean) => void
}
function Arrow( {fill}: { fill: string }){
    return <svg xmlns="http://www.w3.org/2000/svg"   version="1.1" id="Layer_1" viewBox="0 0 330 330"fill={fill}>

        <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213  C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  C255,161.018,253.42,157.202,250.606,154.389z"/>
    </svg>;
}
interface ISearchProps {
    onChange: (a: string) => void
}
enum SearchBy {
    StoreNames,
    PropNames,
    Both,
}
function Search(props: ISearchProps) {
    return (
        <input placeholder="Search!" type="text" onChange={(e) => props.onChange(e.target.value)}/>
    );
}
export default function Home() {
    const [
        search, setSearch,
    ] = useState("");
    const cardsOpen: IcardsOpen = {};
    const [
        searchBy, setSearchBy,
    ] = useState<SearchBy>(SearchBy.StoreNames);
    const storeCards = useMemo(() => {
        const sc : JSX.Element[] = [
        ];
        for (const i in DATA){
            if (search === ""){
                sc.push(<Store name={i} cardsOpen={cardsOpen} />);
                continue;
            }
            const sl = search.toLowerCase();
            switch (searchBy){
                case SearchBy.StoreNames:
                    if (!i.toLowerCase()
                        .includes(sl)) continue;
                    sc.push(<Store key={i} name={i} cardsOpen={cardsOpen} />);
                    continue;
                case SearchBy.PropNames:
                    loop1: for (const item of Object.keys(DATA[i])){
                        if (item.toLowerCase()
                            .includes(sl)){
                            sc.push(<Store key={i} name={i} cardsOpen={cardsOpen} />);
                            break loop1;
                        }
                    }
                    continue;
                case SearchBy.Both:
                    if (i.toLowerCase()
                        .includes(sl)) {
                        sc.push(<Store key={i} name={i} cardsOpen={cardsOpen} />);
                        continue;
                    }
                    loop1: for (const item of Object.keys(DATA[i])){
                        if (item.toLowerCase()
                            .includes(sl)){
                            sc.push(<Store key={i} name={i} cardsOpen={cardsOpen} />);
                            break loop1;
                        }
                    }
                    continue;
            }
        }
        return sc;
    }, [
        search, searchBy,
    ]);


    return (
        <main className={styles.main} >
            <div className={styles.header}>
                <h1>
                    {
                        "Store Reference"
                    }
                </h1>
                <h3>
                    {
                        "You can lookup discord stores and their functions"
                    }
                </h3>
                {
                    "INFO: this was a site I made just for myself to easily lookup stores and to get some experience with jsx."
                }
                <p></p>
                <a href="https://sadan.zip" target="_blank" style={{
                    color: "#ff007c",
                }}
                >
                    Made by sadan
                </a>
            </div>
            <div className={styles.search}>
                <Search onChange={debounce(setSearch)}/>
                <div className={styles.searchSelector}>
                    <span onClick={() => setSearchBy(SearchBy.StoreNames)} className={searchBy === SearchBy.StoreNames ? styles.searchSelected : styles.searchDeselected}>
                        Stores
                    </span>
                    <span onClick={() => setSearchBy(SearchBy.PropNames)} className={searchBy === SearchBy.PropNames ? styles.searchSelected : styles.searchDeselected}>
                        Fields
                    </span>
                    <span onClick={() => setSearchBy(SearchBy.Both)} className={searchBy === SearchBy.Both ? styles.searchSelected : styles.searchDeselected}>
                        &nbsp;Both&nbsp;
                    </span>
                </div>
            </div>
            <div className={styles.cards}>
                {storeCards}
            </div>
        </main>
    );
}
function Entry({name, type}: {
    name: string,
    type: string,
}){
    return <div className={styles.values}>
        <div>
            {name}
        </div>
        <div style={{
            display: "flex",
            fill: "white",
        }}
        >
            <span style={{
                width: "1.5vw",
            }}
            >
                {LogoMap[type](type)}
            </span>
        </div>
    </div>;
}
function Store({name, cardsOpen}:
{ name: string, cardsOpen: IcardsOpen } ){
    const [
        popout, setPopout,
    ] = useState(false);
    cardsOpen[name] = setPopout;
    return <div className={styles.card}
        onClick={() => {
            if (popout) return;
            for (const i in cardsOpen){
                cardsOpen[i](false);
            }
            setPopout(true);
        }}
    >
        <div
            onClick={() => {
                for (const i in cardsOpen){
                    cardsOpen[i](false);
                }
                setPopout(!popout);
            }
            }
            style={{
                display: "flex",
                justifyContent: "space-between",
                color: popout ? "#4fd6be":"#ff007c",
            }}
        >
            <h2>
                {name}
            </h2>
            <div
                className={popout ? styles.toggled:styles.toggle}
            >
                <Arrow fill={popout ? "#4fd6be" : "#ff007c"}></Arrow>
            </div>
        </div>
        {popout && Object.keys(DATA[name])
            .map((a) => <Entry name={a} type={DATA[name][a]}/>)}
    </div>;
}
