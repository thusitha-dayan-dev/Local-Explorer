import { Head } from '@inertiajs/react';
import React from 'react';
import { adminResetPassword, forgetPasswordData } from '@/lib/utils';
import PageSider from '@/pages/web/Auth/components/PageSider';
import AdminForgetPasswordFrom from './components/AdminForgetPasswordForm';

const AdminResetPassword = () => {
    return (
        <main className="form_layout_main">
            <Head title="Admin Reset Password" />
            <PageSider signupPageData={adminResetPassword} />
            <AdminForgetPasswordFrom />
        </main>
    );
};

export default AdminResetPassword;
