import { Row } from './Row';
import Table from './Table';

function RepoInfo({ properties }) {
  const {owner,repository,ref} = properties;

  const data = [
    ['Field:','Expected:','Actual:'],
    ["Owner",owner,owner],
    ["Repository",repository,repository],
    ["Ref (branch)",ref, ref || 'not found'],
  ]
  return <Table header="Project Details" data={data}></Table>;
}

export { RepoInfo };
