import {MuiListInferencer} from "@refinedev/inferencer/mui";
import {GetServerSideProps} from "next";
import {authProvider} from "src/authProvider";
import {useRouter} from 'next/router'
import {JinjatList, JinjatTable} from "@components/crud/list";
import {JinjatCreate} from "@components/crud/create";
import {JinjatShow} from "@components/crud/show";
import React from "react";
import {JinjatEdit} from "@components/crud/edit";
import {useResource} from "@refinedev/core";


export default function ExposurePage() {
    const router = useRouter()
    const {exposure} = router.query
    const [package_name, name, action, id] = exposure
    const {resource} = useResource();

    if (action == 'create') {
        return <JinjatCreate analysis={resource?.meta?.jinjat.resources.create}/>
    } else if (action == 'show') {
        return <JinjatShow/>
    } else if (action == 'edit') {
        return <JinjatEdit/>
    } else if (action == null) {
        let type = resource?.meta?.type;
        if (type == 'analysis') {
            return <JinjatCreate analysis={exposure as string}/>
        } else if(type == 'application') {
            return <JinjatList/>
        }
    }

    return <div>404</div>;
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const {authenticated, redirectTo} = await authProvider.check(context);

    if (!authenticated) {
        return {
            props: {},
            redirect: {
                destination: `${redirectTo}?to=${encodeURIComponent("/blog-posts")}`,
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};
