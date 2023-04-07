import Header from "./header";
import React, { ReactNode } from "react";

interface Props {
    children?: ReactNode
    // any props that come into the component
}

const Layout = ({children}: Props) => (
    <div className="vh-100">
        <Header />
        <main style={{height: "85%"}}>{children}</main>
    </div>
)

export default Layout