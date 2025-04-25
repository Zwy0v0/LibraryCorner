import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout as AntdLayout, Menu, theme, Image, Dropdown, Space, Button } from 'antd';

import styles from './index.module.css'
import { logout } from "../../api/login";

const { Header, Content, Sider } = AntdLayout;
import { createLimiter } from '../../utils/throttleDebounce';



const ITEMS = [
  {
    key: "books",
    label: "Book Management",
    children: [
      { key: "/books", label: "Book List" },
      { key: "/books/add", label: "Book Add" }
    ]
  },
  {
    key: "borrows",
    label: "Borrowing",
    children: [
      { key: "/borrows", label: "Borrowing List" },
      { key: "/borrows/add", label: "Borrowing Add" }
    ]
  },
  {
    key: "categories",
    label: "Category",
    children: [
      { key: "/categories", label: "Category List" },
      { key: "/categories/add", label: "Category Add" }
    ]
  },
  {
    // icon: React.createElement(icon),
    key: "users",
    label: "User Management",
    children: [
      { key: "/users", label: "User List" },
      { key: "/users/add", label: "User Add" }
    ]
  }
]
export function Layout() {
  const navigate = useNavigate();

  const throttledNavigate = createLimiter((key) => {
    navigate(key);
  }, 500, 'throttle');

  const debouncedNavigateToAdd = createLimiter((path) => {
    navigate(path);
  }, 300, 'debounce');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const items = [
    {
      label: (
        <a target="_blank" rel="noopener noreferrer" onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}>
          Log out
        </a>
      ),
      key: '0',
    }
  ];

  const handleLogout = () => {
    logout()
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const selectedKey = location.pathname === "/" ? "/books" : location.pathname;
  const handleMenuClick = ({ key }) => {
    throttledNavigate(key)
  }

  const isListPage = [
    '/',
    '/books',
    '/users',
    '/borrows',
    '/categories'
  ].includes(location.pathname);

  const getTitle = () => {
    if (location.pathname === '/') return 'Book List';
    if (location.pathname === '/books') return 'Book List';
    if (location.pathname === '/books/add') return 'Add new Book';
    if (location.pathname.startsWith('/books/edit')) return 'Editing Book Information';
    if (location.pathname === '/users') return 'Users List';
    if (location.pathname === '/users/add') return 'Add New User';
    if (location.pathname.startsWith('/users/edit')) return 'Editing User Profile';
    if (location.pathname === '/borrows') return 'Borrowing List';
    if (location.pathname === '/borrows/add') return 'Add New Borrowing';
    if (location.pathname === '/categories') return 'Category List';
    if (location.pathname === '/categories/add') return 'Add New Category';
    if (location.pathname.startsWith('/categories/edit')) return 'Editing Category';
    return ' ';
  };

  const getAddPath = () => {
    if (location.pathname === '/' || location.pathname === '/books') return '/books/add';
    if (location.pathname === '/users') return '/users/add';
    if (location.pathname === '/borrows') return '/borrows/add';
    if (location.pathname === '/categories') return '/categories/add';
    return '';
  };


  return (
    <AntdLayout style={{ minHeight: "100vh" }}>
      <Header className={styles.header}>
        <div className={styles['demo-logo']}>
          <Image
            src={`${import.meta.env.BASE_URL}/logo.png`}
            preview={false}
            style={{ width: '100px', height: 'auto' }}
          ></Image>
          Library Corner
          <span className={styles.user}>
            <Dropdown menu={{ items }}>
              <a onClick={e => e.preventDefault()}>
                <Space>
                  {userInfo.nickName}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </span>
        </div>
      </Header>
      <AntdLayout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[selectedKey]}
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['books']}
            style={{ height: '100%', borderRight: 0, textAlign: 'center', fontWeight: 'bold' }}
            items={ITEMS}
            onClick={handleMenuClick}
          />
        </Sider>
        <AntdLayout style={{ padding: '0 32px 32px' }}>
          <Breadcrumb
            items={[]}
            style={{ margin: '0' }} //content上边距
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 4px 12px 16px', }}>
            <h1 style={{ margin: 0 }}>{getTitle()}</h1>
            {isListPage && (
              <Button type="primary" onClick={() => debouncedNavigateToAdd(getAddPath())}>
                Add
              </Button>
            )}
          </div>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </AntdLayout>
      </AntdLayout>
    </AntdLayout>
  );
}