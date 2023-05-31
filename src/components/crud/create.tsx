import React, {useState} from "react";
import {
    HttpError,
    IResourceComponentsProps, useBack, useNavigation,
    useRefineContext,
    useResource, userFriendlyResourceName,
    useRouterType,
    useTranslate
} from "@refinedev/core";
import {Breadcrumb, Create, SaveButton} from "@refinedev/mui";
import {Type, useSchema} from "@components/hooks/useSchema";
import {JsonSchema} from "@jsonforms/core";
import {JinjatForm} from "src/jsonforms/JinjatForm";
import {JinjatProject} from "@components/hooks/schema";
import { useForm } from "@refinedev/core";
import {ErrorObject} from "ajv";
import {JinjatComponentProps} from "@components/crud/list";

export const JinjatCreate: React.FC<JinjatComponentProps> = ({analysis}) => {
    const { formLoading, onFinish } = useForm();

    const [data, setData] = useState<object>({})
    const [errors, setErrors] = useState<ErrorObject[] | null>(null)

    const {data: schema, isLoading, isError} = useSchema<JsonSchema, HttpError>({
        resource: analysis,
        config: {type: Type.REQUEST}
    })

    if(schema == null) {
        return <div>Schema not found!</div>;
    }

    // @ts-ignore
    let pkColumn = schema['x-pk'];
    if(pkColumn != null && schema?.properties != null) {
        delete schema.properties[pkColumn]
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Something went wrong!</div>;
    }

    return <Create isLoading={formLoading} saveButtonProps={{disabled: errors != null && errors.length > 0, onClick: () => onFinish(data)}}>
        <JinjatForm data={data} schema={schema} onChange={setData} onError={setErrors}/>
    </Create>
}