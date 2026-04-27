import { faClock, faFloppyDisk, faImage, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
    faAngleDown,
    faAngleRight,
    faArrowsLeftRight,
    faArrowsUpDown,
    faExclamationCircle,
    faGlobe,
    faLocationDot,
    faMapLocation,
    faMapMarkerAlt,
    faPhone,
    faSignature,
    faTags,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';
import type { ServiceType } from '@/types/web';
import SideNavigation from './components/SideNavigation';
import DynamicSuccessModal from './model/DynamicSuccessModal';

interface formData {
    service_name: string;
    latitude: number | null;
    longitude: number | null;
    description: string;
    short_description: string;
    price_range: string;
    main_image_path: string;
    website_url: string;
    contact_number: string;
    opening_time: string;
    close_time: string;
    address: string;
    search_tags: string;
    service_type_id: number | null;
    media_path: any[];
}

interface PageProps {
    serviceType: ServiceType[];
}

interface PreviewState {
    mainImage: string;
    otherImage: string[];
}

const AddNewService = ({ serviceType }: PageProps) => {
    /*
       @submited data feild
    */
    const serviceForm = useForm<formData>({
        service_name: '',
        latitude: null,
        longitude: null,
        description: '',
        short_description: '',
        price_range: '',
        main_image_path: '',
        website_url: '',
        contact_number: '',
        opening_time: '',
        close_time: '',
        address: '',
        search_tags: '',
        service_type_id: null,
        media_path: [],
    });

    const [indexCount, setIndexCount] = useState(0);

    const [fileInputKey, setFileInputKey] = useState(Date.now());

    /*
     @success model navigate
    */
    const [isSuccessModelOpen, setIsSuccessModelOpen] = useState(false);

    /*
     @validashion infor
    */
    const [validate, setValidate] = useState({
        basic: false,
        contact: false,
        addition: false,
        mainImage: false,
    });

    /*
     @complete message
    */
    const [completeRatio, setCompleteRatio] = useState(0);

    /*
       @change drodown section state
    */
    const [isOpen, setIsOpen] = useState({
        type: false,
        range: false,
    });

    /*
       @preview state
    */
    const [preview, setPreview] = useState<PreviewState>({
        mainImage: '',
        otherImage: [],
    });

    /*
      @description box
    */
    const editor = useEditor({
        extensions: [StarterKit],
        content: serviceForm.data.description,
        onUpdate: ({ editor }) => {
            serviceForm.setData('description', editor.getHTML());
            setIndexCount(editor.getText().length);
        },
    });

    /*
       @handel main image change
    */
    const handelMainImageChange = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            serviceForm.setData('main_image_path', file);
            const previewUrl = URL.createObjectURL(file);
            setPreview({ ...preview, mainImage: previewUrl });
        }
    };

    /*
      @handel other image Change
    */
    const handelOtherImageChange = (e: any) => {
        const files = e.target.files;

        if (!files) return;
        const newFiles = Array.from(files) as File[];
        if (preview.otherImage.length + newFiles.length > 4) {
            alert('Image Maxium Limit Reach');
            return;
        }

        const newPreviews = newFiles.map((file: File) => URL.createObjectURL(file));

        setPreview((prev) => ({
            ...prev,
            otherImage: [...prev.otherImage, ...newPreviews],
        }));

        serviceForm.setData('media_path', [...(Array.isArray(serviceForm.data.media_path) ? serviceForm.data.media_path : []), ...newFiles]);
    };

    /*
      @remove other image
    */
    const removeOtherImage = (index: number) => {
        const newOtherPreviews = preview.otherImage.filter((_, i) => i !== index);
        setPreview({ ...preview, otherImage: newOtherPreviews });
        const currentFiles = Array.isArray(serviceForm.data.media_path) ? (serviceForm.data.media_path as File[]) : [];
        const newFiles = currentFiles.filter((_, i) => i !== index);
        serviceForm.setData('media_path', newFiles);
        URL.revokeObjectURL(preview.otherImage[index]);
    };

    /*
     @validate infor
    */
    useEffect(() => {
        const updateValidate = {
            basic: !!(serviceForm.data.service_name && serviceForm.data.service_type_id && serviceForm.data.short_description),
            contact: !!(serviceForm.data.address && serviceForm.data.latitude && serviceForm.data.longitude && serviceForm.data.search_tags),
            addition: !!(
                serviceForm.data.description &&
                serviceForm.data.price_range &&
                serviceForm.data.close_time &&
                serviceForm.data.opening_time
            ),
            mainImage: !!serviceForm.data.main_image_path,
        };

        setValidate((prev) => ({
            ...prev,
            ...updateValidate,
        }));
        const completeCount = Object.values(updateValidate).filter(Boolean).length;
        const totalCount = Object.keys(updateValidate).length;
        const ratio = (completeCount / totalCount) * 100;
        setCompleteRatio(ratio);
    }, [serviceForm.data]);

    /*
      @price range list
    */
    const priceRange = ['high', 'medium', 'low', 'none'];

    /*
      @navigate with useRef
    */
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    /*
        @handel navigate with click side bar navigation void
    */
    const handleNavClick = (index: number) => {
        scrollToSection(index);
    };

    /*
        @scrow section void
    */
    const scrollToSection = (index: number) => {
        const section = sectionRefs.current[index];
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    /*
      @handelSubmit
    */
    const handleSubmit = (e: any) => {
        e.preventDefault();

        serviceForm.post('/admin/create-service', {
            forceFormData: true,
            onSuccess: () => {
                serviceForm.reset();
                if (editor) editor.commands.setContent('');
                setPreview({ mainImage: '', otherImage: [] });
                setIsSuccessModelOpen(true);
                setFileInputKey(Date.now());
            },
            onError: (errors) => {
                const firstError = Object.keys(errors)[0];
                let targetIndex = -1;
                if (['service_name', 'service_type_id', 'short_description'].includes(firstError)) {
                    targetIndex = 0;
                } else if (['address', 'latitude', 'longitude', 'contact_number', 'search_tags'].includes(firstError)) {
                    targetIndex = 1;
                } else if (
                    ['opening_time', 'close_time', 'main_image_path', 'media_path', 'description', 'website_url', 'price_range'].includes(firstError)
                ) {
                    targetIndex = 2;
                }
                if (targetIndex !== -1) {
                    scrollToSection(targetIndex);
                }
            },
        });
    };

    return (
        <section className="admin_dashboard_main">
            <Head title="Add New Services" />
            <SideNavigation />
            <section className="page_main_layout">
                <main className="page_main">
                    <section className="page_hedder">
                        <div className="box_layout">
                            <h1>Add Nearby Service</h1>
                            <div className="box">
                                <Link href={route('admin.dashboard')} className="link">
                                    Dashboard
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <Link href={route('admin.manage.service')} className="link">
                                    Manage Service
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <span className="sub_link">Add new Service</span>
                            </div>
                        </div>
                        <Link href={route('admin.manage.service.type')} className="btn">
                            Add new Service Type
                        </Link>
                    </section>
                    <section className="page_content_layout">
                        <form className="service_form" onSubmit={handleSubmit}>
                            <section
                                className="form_helight_section"
                                ref={(el) => {
                                    sectionRefs.current[0] = el;
                                }}
                            >
                                <div className="section_hedder">
                                    <h1>
                                        <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                                        Basic Details
                                    </h1>
                                </div>
                                <section className="input_section">
                                    <div className="form_input_layout">
                                        <div className="input_group">
                                            <label htmlFor="service_name" className="lb">
                                                Service Name <sup className="op">*</sup>
                                            </label>
                                            <div className="input_holder">
                                                <input
                                                    type="text"
                                                    name="serviceName"
                                                    id="service_name"
                                                    className="form_input sub"
                                                    placeholder="Example: Dambulla Market"
                                                    onChange={(e) => serviceForm.setData('service_name', e.target.value)}
                                                    value={serviceForm.data.service_name}
                                                />
                                                <FontAwesomeIcon icon={faSignature} className="logo" />
                                                <span className="length">{`${serviceForm.data.service_name.length} /100`}</span>
                                            </div>
                                            {serviceForm.errors.service_name && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {serviceForm.errors.service_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="input_group">
                                            <label htmlFor="type" className="lb">
                                                Service Type <sup className="op">*</sup>
                                            </label>
                                            <div className="selector_holder">
                                                <input
                                                    type="text"
                                                    name="ServiceType"
                                                    id="type"
                                                    placeholder="Select Service Type"
                                                    readOnly={true}
                                                    className="form_input"
                                                    onClick={() => {
                                                        isOpen.type ? setIsOpen({ ...isOpen, type: false }) : setIsOpen({ ...isOpen, type: true });
                                                    }}
                                                    value={
                                                        serviceType.find((type) => serviceForm.data.service_type_id == type.id)?.service_type_name ||
                                                        ''
                                                    }
                                                />
                                                <FontAwesomeIcon icon={faAngleDown} className="togel" />
                                                {isOpen.type && (
                                                    <ul className="selector">
                                                        {serviceType.length <= 0 && (
                                                            <li
                                                                onClick={() => {
                                                                    setIsOpen({ ...isOpen, type: false });
                                                                }}
                                                            >
                                                                <Link
                                                                    href={route('admin.manage.service.type')}
                                                                    style={{ color: 'red', display: 'flex', gap: '15px', textDecoration: 'none' }}
                                                                >
                                                                    Service Type Not Found!
                                                                    <span style={{ textDecoration: 'none', color: 'blue' }}>Add Now</span>
                                                                </Link>
                                                            </li>
                                                        )}
                                                        {serviceType.map((type) => (
                                                            <li
                                                                key={type.id}
                                                                onClick={() => {
                                                                    serviceForm.setData('service_type_id', type.id);
                                                                    setIsOpen({ ...isOpen, type: false });
                                                                }}
                                                            >
                                                                {type.service_type_name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            {serviceForm.errors.service_type_id && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {serviceForm.errors.service_type_id}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="input_group">
                                        <label htmlFor="sDescription" className="lb">
                                            Helight <sup className="op">*</sup>
                                        </label>
                                        <div className="description_holder">
                                            <textarea
                                                name="sDescription"
                                                id="sDescription"
                                                className="text_aria"
                                                rows={8}
                                                value={serviceForm.data.short_description}
                                                onChange={(e) => serviceForm.setData('short_description', e.target.value)}
                                            ></textarea>
                                            <span className="length">{`${serviceForm.data.short_description.length} /250`}</span>
                                        </div>
                                        {serviceForm.errors.short_description && (
                                            <span className="error">
                                                <FontAwesomeIcon icon={faExclamationCircle} />
                                                {serviceForm.errors.short_description}
                                            </span>
                                        )}
                                    </div>
                                </section>
                            </section>
                            <section
                                className="form_helight_section"
                                ref={(el) => {
                                    sectionRefs.current[1] = el;
                                }}
                            >
                                <div className="section_hedder">
                                    <h1>
                                        <FontAwesomeIcon icon={faMapLocation} className="icon" />
                                        Contact & Location
                                    </h1>
                                </div>
                                <section className="input_section">
                                    <div className="form_input_layout">
                                        <div className="input_group">
                                            <label htmlFor="address" className="lb">
                                                Address <sup className="op">*</sup>
                                            </label>
                                            <div className="input_holder">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    className="form_input sub"
                                                    placeholder="Example: Mathale road, dambulla"
                                                    onChange={(e) => serviceForm.setData('address', e.target.value)}
                                                    value={serviceForm.data.address}
                                                />
                                                <FontAwesomeIcon icon={faLocationDot} className="logo" />
                                            </div>
                                            {serviceForm.errors.address && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {serviceForm.errors.address}
                                                </span>
                                            )}
                                        </div>
                                        <div className="form_input_layout">
                                            <div className="input_group">
                                                <label htmlFor="latitude" className="lb">
                                                    Latitude <sup className="op">*</sup>
                                                </label>
                                                <div className="input_holder">
                                                    <input
                                                        type="number"
                                                        name="latitude"
                                                        id="latitude"
                                                        placeholder="1.0002"
                                                        className="form_input sub"
                                                        onChange={(e) => serviceForm.setData('latitude', Number(e.target.value))}
                                                        value={serviceForm.data.latitude || ''}
                                                    />
                                                    <FontAwesomeIcon icon={faArrowsUpDown} className="logo" />
                                                </div>
                                                {serviceForm.errors.latitude && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {serviceForm.errors.latitude}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="input_group">
                                                <label htmlFor="longitude" className="lb">
                                                    Longitude <sup className="op">*</sup>
                                                </label>
                                                <div className="input_holder">
                                                    <input
                                                        type="number"
                                                        name="longitude"
                                                        id="longitude"
                                                        placeholder="1.1175"
                                                        className="form_input sub"
                                                        onChange={(e) => serviceForm.setData('longitude', Number(e.target.value))}
                                                        value={serviceForm.data.longitude || ''}
                                                    />
                                                    <FontAwesomeIcon icon={faArrowsLeftRight} className="logo" />
                                                </div>
                                                {serviceForm.errors.longitude && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {serviceForm.errors.longitude}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_input_layout">
                                        <div className="input_group">
                                            <label htmlFor="contact" className="lb">
                                                Contact Number <sup className="op"></sup>
                                            </label>
                                            <div className="input_holder">
                                                <input
                                                    type="text"
                                                    name="contact"
                                                    id="contact"
                                                    className="form_input sub"
                                                    placeholder="Example: 0112 755 755"
                                                    onChange={(e) => serviceForm.setData('contact_number', e.target.value)}
                                                    value={serviceForm.data.contact_number}
                                                />
                                                <FontAwesomeIcon icon={faPhone} className="logo" />
                                            </div>
                                            {serviceForm.errors.contact_number && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {serviceForm.errors.contact_number}
                                                </span>
                                            )}
                                        </div>
                                        <div className="input_group">
                                            <label htmlFor="search" className="lb">
                                                Search Tags <sup className="op">*</sup>
                                            </label>
                                            <div className="input_holder">
                                                <input
                                                    type="text"
                                                    name="search"
                                                    id="search"
                                                    className="form_input sub"
                                                    placeholder="Example: #market #service"
                                                    onChange={(e) => serviceForm.setData('search_tags', e.target.value)}
                                                    value={serviceForm.data.search_tags}
                                                />
                                                <FontAwesomeIcon icon={faTags} className="logo" />
                                            </div>
                                            {serviceForm.errors.search_tags && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {serviceForm.errors.search_tags}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            </section>
                            <section
                                className="form_helight_section"
                                ref={(el) => {
                                    sectionRefs.current[2] = el;
                                }}
                            >
                                <div className="section_hedder">
                                    <h1>
                                        <FontAwesomeIcon icon={faClock} className="icon" />
                                        Additional Info & Media
                                    </h1>
                                </div>
                                <section className="input_section">
                                    <div className="input_group">
                                        <label htmlFor="discription" className="lb">
                                            Description <sup className="op">*</sup>
                                        </label>
                                        <div className="description_holder" style={{ width: '100%' }}>
                                            <div className="editor-container" style={{ position: 'relative' }}>

                                                <div className="toolbar">

                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().setParagraph().run()}
                                                        className={editor.isActive('paragraph') ? 'is-active' : ''}
                                                    >
                                                        P
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                                        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                                                    >
                                                        H1
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                                        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                                                    >
                                                        H2
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                                                        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                                                    >
                                                        H3
                                                    </button>

                                                    <div className="divider"></div>


                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                                        className={editor.isActive('bold') ? 'is-active' : ''}
                                                    >
                                                        <b>B</b>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleItalic().run()}
                                                        className={editor.isActive('italic') ? 'is-active' : ''}
                                                    >
                                                        <i>I</i>
                                                    </button>

                                                    <div className="divider"></div>


                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                                                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                                                    >
                                                        • List
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                                                    >
                                                        1. List
                                                    </button>
                                                </div>

                                 
                                                <EditorContent editor={editor} id="discription" />
                                            </div>
                                            <span className="length">{`${indexCount} / 5000`}</span>
                                        </div>
                                        {serviceForm.errors.description && (
                                            <span className="error">
                                                <FontAwesomeIcon icon={faExclamationCircle} />
                                                {serviceForm.errors.description}
                                            </span>
                                        )}
                                    </div>
                                    <div className="form_input_layout">
                                        <div className="form_input_layout">
                                            <div className="input_group">
                                                <label htmlFor="sType" className="lb">
                                                    Price Range <sup className="op">*</sup>
                                                </label>
                                                <div className="selector_holder">
                                                    <input
                                                        type="text"
                                                        name="sType"
                                                        id="sType"
                                                        className="form_input"
                                                        placeholder="Select Price Range"
                                                        readOnly={true}
                                                        value={
                                                            serviceForm.data.price_range.charAt(0).toLocaleUpperCase() +
                                                            serviceForm.data.price_range.slice(1)
                                                        }
                                                        onClick={() => {
                                                            !isOpen.range
                                                                ? setIsOpen({ ...isOpen, range: true })
                                                                : setIsOpen({ ...isOpen, range: false });
                                                        }}
                                                    />
                                                    <FontAwesomeIcon icon={faAngleDown} className="togel" />
                                                    {isOpen.range && (
                                                        <ul className="selector">
                                                            {priceRange.map((range, index) => (
                                                                <li
                                                                    key={index}
                                                                    onClick={() => {
                                                                        serviceForm.setData('price_range', range);
                                                                        setIsOpen({ ...isOpen, range: false });
                                                                    }}
                                                                >
                                                                    {range.charAt(0).toLocaleUpperCase() + range.slice(1)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                                {serviceForm.errors.price_range && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {serviceForm.errors.price_range}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="input_group">
                                                <label htmlFor="url" className="lb">
                                                    Website URL <sup className="op"></sup>
                                                </label>
                                                <div className="input_holder">
                                                    <input
                                                        type="url"
                                                        name="url"
                                                        id="url"
                                                        placeholder="https://dambullaMarket.lk"
                                                        className="form_input sub"
                                                        onChange={(e) => serviceForm.setData('website_url', e.target.value)}
                                                    />
                                                    <FontAwesomeIcon icon={faGlobe} className="logo" />
                                                </div>
                                                {serviceForm.errors.website_url && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {serviceForm.errors.website_url}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form_input_layout">
                                            <div className="input_group">
                                                <label htmlFor="cTime" className="lb">
                                                    Close Time <sup className="op">*</sup>
                                                </label>
                                                <input
                                                    type="time"
                                                    name="cTime"
                                                    id="cTime"
                                                    className="form_input time"
                                                    value={serviceForm.data.close_time}
                                                    onChange={(e) => serviceForm.setData('close_time', e.target.value)}
                                                />
                                                {serviceForm.errors.close_time && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {serviceForm.errors.close_time}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="input_group">
                                                <label htmlFor="oTime" className="lb">
                                                    Opening Time <sup className="op">*</sup>
                                                </label>
                                                <input
                                                    type="time"
                                                    name="oTime"
                                                    id="oTime"
                                                    className="form_input time"
                                                    value={serviceForm.data.opening_time}
                                                    onChange={(e) => serviceForm.setData('opening_time', e.target.value)}
                                                />
                                                {serviceForm.errors.opening_time && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {serviceForm.errors.opening_time}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_input_layout">
                                        <div className="input_group">
                                            <span className="lb">
                                                Service Main Image <sup className="op">*</sup>
                                            </span>
                                            <div className="fack_input">
                                                <input
                                                    type="file"
                                                    name="mainImage"
                                                    id="mainImage"
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    max={1}
                                                    key={fileInputKey}
                                                    onChange={handelMainImageChange}
                                                />
                                                <span className="choos_message">{`${preview.mainImage ? 1 : 0}/1 File selected`}</span>
                                                <label htmlFor="mainImage" className="image_input">
                                                    Browse
                                                </label>
                                            </div>
                                            {serviceForm.errors.main_image_path && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {serviceForm.errors.main_image_path}
                                                </span>
                                            )}
                                        </div>
                                        <div className="input_group">
                                            <span className="lb">Other Image</span>
                                            <div className="fack_input">
                                                <input
                                                    type="file"
                                                    name="otherImage"
                                                    id="otherImage"
                                                    key={fileInputKey + 1}
                                                    style={{ display: 'none' }}
                                                    onChange={handelOtherImageChange}
                                                />
                                                <span className="choos_message">{`${preview.otherImage.length}/4 File selected`}</span>
                                                <label htmlFor="otherImage" className="image_input">
                                                    Browse
                                                </label>
                                            </div>
                                            {serviceForm.errors.media_path && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {serviceForm.errors.media_path}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {(preview.mainImage || preview.otherImage.length > 0) && (
                                        <section className="image_priview_layout">
                                            {preview.mainImage && (
                                                <div className="input_group">
                                                    <span className="lb">Main Image Preview</span>
                                                    <div className="image_contener_main">
                                                        <img src={preview.mainImage} alt="" />
                                                        <FontAwesomeIcon
                                                            icon={faTrashCan}
                                                            className="icon"
                                                            onClick={() => {
                                                                setPreview({ ...preview, mainImage: '' });
                                                                serviceForm.setData('main_image_path', '');
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {preview.otherImage.length > 0 && (
                                                <div className="input_group">
                                                    <span className="lb">Other Image Preview</span>
                                                    <div className="image_contener_other">
                                                        {preview.otherImage.map((imgs, index) => (
                                                            <div className="image_hodelr" key={index}>
                                                                <img src={imgs} alt="preview other image" />
                                                                <FontAwesomeIcon
                                                                    icon={faTrashCan}
                                                                    className="icon"
                                                                    onClick={() => removeOtherImage(index)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </section>
                                    )}
                                </section>
                            </section>
                            <section className="form_helight_section" style={{ marginBottom: '15px' }}>
                                <div className="input_btn_group">
                                    <div className="btn_group">
                                        <button className="btn sub" type="button">
                                            <FontAwesomeIcon icon={faTrashCan} className="icon" />
                                            Clear Data
                                        </button>
                                        <button className="btn" type="submit">
                                            <FontAwesomeIcon icon={faFloppyDisk} className="icon" />
                                            Save Service
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </form>
                        <div className="service_right_card">
                            <div className="right_content">
                                <div className="complete_ratio_layout">
                                    <span className="sub_message">Complete Ratio</span>
                                    <div className="ratio_layout">
                                        <div className="progres_bar">
                                            <div className="bar" style={{ width: `${completeRatio || 7}%` }}></div>
                                        </div>
                                        <span>{`${completeRatio}%`}</span>
                                    </div>
                                </div>
                                <div className="required_layout">
                                    <span>Required Fields</span>
                                    <ul className="required">
                                        <li onClick={() => handleNavClick(0)}>
                                            <div className={`mg ${validate.basic ? 'active' : ''}`}>
                                                <FontAwesomeIcon icon={faAngleDown} className="icon" />
                                                Basic Details
                                            </div>
                                        </li>
                                        <li onClick={() => handleNavClick(1)}>
                                            <div className={`mg ${validate.contact ? 'active' : ''}`}>
                                                <FontAwesomeIcon icon={faAngleDown} className="icon" />
                                                Contact & Location
                                            </div>
                                        </li>
                                        <li onClick={() => handleNavClick(2)}>
                                            <div className={`mg ${validate.addition ? 'active' : ''}`}>
                                                <FontAwesomeIcon icon={faAngleDown} className="icon" />
                                                Additional Info
                                            </div>
                                        </li>
                                        <li onClick={() => handleNavClick(2)}>
                                            <div className={`mg ${validate.mainImage ? 'active' : ''}`}>
                                                <FontAwesomeIcon icon={faAngleDown} className="icon" />
                                                Service Media
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="live-preview-container">
                                    <div className="preview-header">
                                        <span className="preview-label">Live Preview</span>
                                        <div className="preview-status">
                                            <span className="status-dot"></span>
                                            Real-time
                                        </div>
                                    </div>

                                    <div className="preview-card-wrapper">
                                        <div className="preview-card">
                                            <div className="card-image-section">
                                                {serviceForm.data.main_image_path ? (
                                                    <img
                                                        src={preview.mainImage}
                                                        alt={serviceForm.data.service_name || 'Preview'}
                                                        className="card-image"
                                                    />
                                                ) : (
                                                    <div className="image-placeholder">
                                                        <FontAwesomeIcon icon={faImage} className="placeholder-icon" />
                                                        <span className="placeholder-text">Image Preview</span>
                                                    </div>
                                                )}
                                                <span className="card-category">
                                                    {serviceForm.data.service_type_id ? `Category ${serviceForm.data.service_type_id}` : 'Category'}
                                                </span>
                                            </div>

                                            <div className="card-content-section">
                                                <h5 className="card-title truncate">{serviceForm.data.service_name || 'Your Destination Name'}</h5>

                                                <div className="card-location">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                                                    <span className="location-text truncate">{serviceForm.data.address || 'Location Address'}</span>
                                                </div>

                                                <p className="card-description line-clamp-2">
                                                    {serviceForm.data.short_description ||
                                                        'A brief, catchy description of the place will appear here. Try to keep it under 160 characters.'}
                                                </p>

                                                <div className="card-meta-data">
                                                    <div className="meta-item">
                                                        <FontAwesomeIcon icon={faClock} className="meta-icon" />
                                                        <span>{serviceForm.data.opening_time || 'Open'}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <FontAwesomeIcon icon={faClock} className="meta-icon" />
                                                        <span>{serviceForm.data.close_time || 'Close'}</span>
                                                    </div>
                                                </div>

                                                <div className="card-footer">
                                                    <div className="price-label">Starting From</div>
                                                    <div className="card-price">
                                                        <span className="currency">{serviceForm.data.price_range}</span>
                                                        <span className="per-person">/ Range</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DynamicSuccessModal
                            isOpen={isSuccessModelOpen}
                            onClose={() => setIsSuccessModelOpen(false)}
                            title="Success!"
                            message={'Neabry Searvice Add Success Full!'}
                        />
                    </section>
                </main>
            </section>
        </section>
    );
};

export default AddNewService;
