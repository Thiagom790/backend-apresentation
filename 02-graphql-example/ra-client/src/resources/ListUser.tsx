import { gql, useSubscription } from "@apollo/client";
import {
  ArrayField,
  ChipField,
  Datagrid,
  List,
  SingleFieldList,
  TextField,
} from "react-admin";

const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    newsFeed {
      title
      description
    }
  }
`;

function ListAside() {
  const { data, loading: isLoading } = useSubscription(COMMENTS_SUBSCRIPTION);

  console.log({ data, isLoading });

  return (
    <div style={{ width: 200, margin: "1rem" }}>
      {isLoading && <div>Loading...</div>}
      <h1>{data?.newsFeed?.title}</h1>
      <p>{data?.newsFeed?.description}</p>
    </div>
  );
}

export function ListUser() {
  return (
    <List aside={<ListAside />}>
      <Datagrid>
        <TextField label="ID" source="id"></TextField>
        <TextField label="Nome" source="name"></TextField>
        <ArrayField label="Organizações" source="organizations">
          <SingleFieldList linkType={false}>
            <ChipField source="name" size="small" />
          </SingleFieldList>
        </ArrayField>
      </Datagrid>
    </List>
  );
}
