import React from "react";
import { useParams } from 'react-router-dom';
import { history } from '@umijs/max';

const Token: React.FC = () => {
  const params  = useParams();
  localStorage.setItem('token', params.id);
  history.push('/welcome');
  return (<span>登录成功</span>);
};
export default Token;
