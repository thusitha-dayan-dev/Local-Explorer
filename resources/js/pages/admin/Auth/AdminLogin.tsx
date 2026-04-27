import { Head } from '@inertiajs/react';
import React from 'react';
import { adminLoginData, signupPageData } from '@/lib/utils';
import PageSider from '@/pages/web/Auth/components/PageSider';
import AdminLoginForm from './components/AdminLoginForm';

const AdminLogin = () => {
    return (
        <main className="form_layout_main">
            <Head title="Admin Login" />
            <PageSider signupPageData={adminLoginData} />
            <AdminLoginForm />
        </main>
    );
};

export default AdminLogin;
