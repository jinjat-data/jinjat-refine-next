import {
    HttpError,
    LiveModeProps,
    SuccessErrorNotification,
    useHandleNotification,
    useTranslate,
} from "@refinedev/core";
import { MetaQuery } from "@refinedev/core";
import {useEffect, useState} from "react";
import {IJinjatContextProvider, JinjatProject} from "@components/hooks/schema";


export type UseProjectSchemaProps = {
    schemaContext: IJinjatContextProvider
    meta?: MetaQuery;
} & SuccessErrorNotification &
    LiveModeProps;

export interface JinjatProjectResponse {
    data?: JinjatProject,
    error?: HttpError,
    isLoading?: boolean
}


export const useJinjatProject = ({
                             schemaContext,
                             successNotification,
                             errorNotification,
                             meta,
                         }: UseProjectSchemaProps): JinjatProjectResponse => {
    const translate = useTranslate();

    const handleNotification = useHandleNotification();

    const [data, setData] = useState<JinjatProject>()
    const [error, setError] = useState<HttpError>();
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        schemaContext.getProject(meta)
            .then(data => {
                setData(data);

                const notificationConfig =
                    typeof successNotification === "function"
                        ? successNotification(
                            data,
                            {meta: meta},
                        )
                        : successNotification;

                handleNotification(notificationConfig);
            })
            .catch(err => {
                setError(err);

                const notificationConfig =
                    typeof errorNotification === "function"
                        ? errorNotification(err, {meta: meta})
                        : errorNotification;

                handleNotification(notificationConfig, {
                    key: `useMenus-notification`,
                    message: translate(
                        "notifications.error",
                        {statusCode: err.statusCode},
                        `Error (status code: ${err.statusCode})`,
                    ),
                    description: err.message,
                    type: "error",
                });
            }).finally(() => setLoading(false))
    }, []);

    return {data, error, isLoading};
};
