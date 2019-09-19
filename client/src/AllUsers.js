import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";
const { Column, ColumnGroup } = Table;

const req = axios.create({
  baseURL: "http://localhost:8641/",
  withCredentials: true
});
const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const axiosGet = async () => {
      try {
        const users = await req.get("/api/restricted/users");
        setAllUsers(users.data);
      } catch (err) {
        console.log(err);
      }
    };
    axiosGet();
  }, [setAllUsers]);

  return (
    <Table dataSource={allUsers} rowKey={record => record.id}>
      <ColumnGroup title="Users">
        <Column title="Username" dataIndex="username" key="username" />
      </ColumnGroup>
    </Table>
  );
};

export default AllUsers;
