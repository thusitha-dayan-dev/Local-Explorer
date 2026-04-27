import { Head, Link } from '@inertiajs/react';
import React from 'react';

import { adminResetPassword } from '@/lib/utils';
import PageSider from '@/pages/web/Auth/components/PageSider';
import EmailSentSuccessMassage from './components/EmailSentSuccessMassage';

const EmailSentSuccess = ({ email }: any) => {
    return (
        <main className="form_layout_main">
            <PageSider signupPageData={adminResetPassword} />
            <EmailSentSuccessMassage email={email} />
        </main>
    );
};

export default EmailSentSuccess;
