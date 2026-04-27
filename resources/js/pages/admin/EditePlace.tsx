import { faClock, faFileZipper, faFloppyDisk, faImage, faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
    faAngleDown,
    faAngleLeft,
    faAngleRight,
    faAt,
    faClapperboard,
    faExclamationCircle,
    faGlobe,
    faLocationDot,
    faMapLocation,
    faMapMarkerAlt,
    faPhone,
    faSignature,
    faTag,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, Link, useForm } from '@inertiajs/react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Category, Place, SubCategory } from '@/types/web';
import SideNavigation from './components/SideNavigation';

interface pageProps {
    category: Category[];
    subCategory: Record<number, SubCategory[]>;
    placeData: Place;
}

interface TripFormData {
    place_name: string;
    description: string;
    short_description: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    base_distance: number | null;
    local_ticket_price: number | null;
    foreign_ticket_price: number | null;
    estimated_duration: number | null;
    opening_time: string;
    closing_time: string;
    best_visit_time: string;
    contact_number: string;
    website_url: string;
    main_image_path: string;
    search_tags: string;
    selection_count: number | null;
    crowd_level: string;
    category_id: number | null;
    sub_category_id: number | null;
    media_path: any[];
    deleted_media_ids: any[];
}

const EditePlace = ({ category, subCategory, placeData }: pageProps) => {
    /*
       @media preview state
    */
    const existingVideo = placeData?.media?.find((m: any) => m.media_type === 'video');

    const [imagePreview, setImagePreview] = useState({
        mainImage: placeData?.main_image_path ? `/storage/${placeData.main_image_path}` : '',

        otherImage: placeData?.media
            ? placeData.media.filter((m: any) => m.media_type === 'image').map((m: any) => ({ id: m.id, url: `/storage/${m.media_path}` }))
            : ([] as { id?: number; url: string }[]),

        vedio: existingVideo ? { id: existingVideo.id, url: `/storage/${existingVideo.media_path}` } : (null as { id?: number; url: string } | null),
    });

    /*
        @frond end validashion state
    */
    const [validate, setValidate] = useState({
        basic: false,
        conent: false,
        location: false,
        visiting: false,
        media: false,
    });

    /*
        @custom Dropdown state
    */
    const [dropDown, setDropDown] = useState({
        category: false,
        subCategory: false,
        crowd: false,
    });

    /*
        @add palce submit form, useForm
    */
    const { data, setData, post, processing, errors, setError, clearErrors, reset } = useForm<TripFormData>({
        place_name: placeData?.place_name ?? '',
        description: placeData?.description ?? '',
        short_description: placeData?.short_description ?? '',
        address: placeData?.address ?? '',
        latitude: placeData?.latitude ?? null,
        longitude: placeData?.longitude ?? null,
        base_distance: Number(placeData?.base_distance) ?? null,
        local_ticket_price: placeData?.local_ticket_price ?? null,
        foreign_ticket_price: placeData?.foreign_ticket_price ?? null,
        estimated_duration: placeData?.estimated_duration ?? null,
        opening_time: placeData?.opening_time?.slice(0, 5) ?? '08:00',
        closing_time: placeData?.closing_time?.slice(0, 5) ?? '17:30',
        best_visit_time: placeData?.best_visit_time?.slice(0, 5) ?? '',
        contact_number: placeData?.contact_number ?? '',
        website_url: placeData?.website_url ?? '',
        main_image_path: placeData?.main_image_path ?? '',
        search_tags: placeData?.search_tags ?? '',
        selection_count: placeData?.selection_count ?? 0,
        crowd_level: placeData?.crowd_level ?? 'Medium',
        category_id: placeData?.category_id ?? null,
        sub_category_id: placeData?.sub_category_id ?? null,
        media_path: [] as any[],
        deleted_media_ids: [] as number[],
    });

    /*
        @handel click outside close use state
    */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.selector')) {
                setDropDown({ ...dropDown, category: false, subCategory: false, crowd: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    /*
        @complete ratio state
    */
    const [completeRatio, setCompleteRatio] = useState(0);

    /*
        @navigate with useRef
    */
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    /*
        @clear with change vedio input useRef
    */
    const videoInputRef = useRef<HTMLInputElement>(null);

    /*
        @handel navigate with click side bar navigation void
    */
    const handleNavClick = (sectionName: string, index: number) => {
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
        @genatate price format
    */
    const formatPrice = (price: any) => {
        if (!price || isNaN(price)) return '0';
        return new Intl.NumberFormat('en-LK').format(price);
    };

    /*
        @remove media priview video
    */
    const removeVideo = () => {
        const filteredMedia = (data.media_path as any[]).filter((item) => item.type !== 'video');
        setData('media_path', filteredMedia);

        if (imagePreview.vedio?.id) {
            setData('deleted_media_ids', [...data.deleted_media_ids, imagePreview.vedio.id]);
        }

        setImagePreview({ ...imagePreview, vedio: null });

        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    /*
        @remove image priview
    */
    const removeOtherImage = (index: number, mediaId?: number) => {
        const newPreviews = imagePreview.otherImage.filter((_, i) => i !== index);
        setImagePreview({ ...imagePreview, otherImage: newPreviews });

        if (mediaId) {
            setData((prevData) => ({
                ...prevData,
                deleted_media_ids: [...prevData.deleted_media_ids, mediaId],
            }));
        } else {
        }
    };

    /*
        @get description box length with out tag
    */
    const [pureCharCount, setPureCharCount] = useState(0);

    /*
        @descripion editer steup
    */
    const editor = useEditor({
        extensions: [StarterKit],
        content: data.description,
        onUpdate: ({ editor }) => {
            setData('description', editor.getHTML());
            setPureCharCount(editor.getText().length);
        },
    });

    /*
        @update back end data editer decription
    */
    useEffect(() => {
        if (editor && data.description && editor.isEmpty) {
            editor.commands.setContent(data.description);
        }
    }, [editor, data.description]);

    /*
        @for showing crowd level in dropdown
    */
    const crowdStatus = ['low', 'medium', 'high'];

    /*
        @main image data handel
    */
    const handelMainImageChange = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            setData('main_image_path', file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview({ ...imagePreview, mainImage: previewUrl });
        }
    };

    /*
        @other media change handel
    */
    const handelMediaChange = (e: any) => {
        const file = e.target.files[0];
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const currentVideos = (data.media_path as any[]).filter((item) => item.type === 'video').length;
        const currentImages = (data.media_path as any[]).filter((item) => item.type === 'image').length;

        if (isVideo && currentVideos >= 1) {
            alert('You can only upload 1 video.');
            return;
        }

        if (!isVideo && currentImages >= 4) {
            alert('You can only upload up to 4 other images.');
            return;
        }

        const newMediaEntry = {
            file: file,
            type: isVideo ? 'video' : 'image',
        };

        setData('media_path', [...(data.media_path as any[]), newMediaEntry]);

        const previewUrl = URL.createObjectURL(file);
        if (isVideo) {
            setImagePreview({
                ...imagePreview,
                vedio: { url: previewUrl },
            });
        } else {
            setImagePreview({
                ...imagePreview,
                otherImage: [...imagePreview.otherImage, { url: previewUrl }],
            });
        }
    };

    /*
        @get selected subcategory from category
    */
    const currentSubCategories = useMemo(() => {
        if (!data.category_id) return [];
        return subCategory[data.category_id] || [];
    }, [data.category_id, subCategory]);

    /*
        @handel input data change
    */
    useEffect(() => {
        const updatedValidation = {
            basic: !!(data.place_name && data.category_id && data.sub_category_id && data.search_tags),
            conent: data.description.length > 50 && data.short_description.length > 20,
            location: !!(data.address.length > 5 && data.latitude && data.longitude),
            visiting: !!(data.opening_time && data.closing_time && data.estimated_duration && data.base_distance),
            media: !!data.main_image_path,
        };
        setValidate((prev) => ({
            ...prev,
            ...updatedValidation,
        }));
        const completedCount = Object.values(updatedValidation).filter(Boolean).length;
        const totalCount = Object.keys(updatedValidation).length;
        const ratio = (completedCount / totalCount) * 100;
        setCompleteRatio(ratio);
    }, [data]);

    /*
        @handel form submit event
    */
    const handleSubmit = (e: any) => {
        e.preventDefault();

        post(`/admin/edit-place/${placeData.id}`, {
            forceFormData: true,
            onSuccess: () => {},
            onError: (errors) => {
                const firstError = Object.keys(errors)[0];
                let targetIndex = -1;
                if (['place_name', 'category_id', 'sub_category_id', 'search_tags'].includes(firstError)) {
                    targetIndex = 0;
                } else if (['description', 'short_description'].includes(firstError)) {
                    targetIndex = 1;
                } else if (['address', 'latitude', 'longitude'].includes(firstError)) {
                    targetIndex = 2;
                } else if (['opening_time', 'closing_time', 'estimated_duration', 'base_distance'].includes(firstError)) {
                    targetIndex = 3;
                } else if (['main_image_path', 'media_path'].includes(firstError)) {
                    targetIndex = 4;
                }

                if (targetIndex !== -1) {
                    scrollToSection(targetIndex);
                }
            },
        });
    };

    return (
        <section className="admin_dashboard_main">
            <SideNavigation />
            <Head title={`Edite Place ${placeData.id}`} />
            <div className="page_content">
                <section className="page_content_layout">
                    <nav className="page_hedder">
                        <div className="hedd">
                            <h1>Edit Place {`(${placeData.place_name})`}</h1>
                            <div className="other_navigation">
                                <Link className="link" href={'/admin/dashboard'}>
                                    Dashboard
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <Link className="link" href={'/admin/manage-place'}>
                                    Manage Places
                                </Link>
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                                <span>Edit Place</span>
                            </div>
                        </div>
                        <div className="button_group">
                            <Link className="btn" href={'/admin/manage-place'}>
                                Back To Page
                                <FontAwesomeIcon icon={faAngleRight} className="icon" />
                            </Link>
                        </div>
                    </nav>
                    <main className="page_main_conetent_layout">
                        <form id="add-place-form" className="page_main_content" onSubmit={handleSubmit}>
                            <div className="form_content">
                                <div
                                    className="back_apire"
                                    ref={(el) => {
                                        sectionRefs.current[0] = el;
                                    }}
                                >
                                    <div className="form_content_hedder">
                                        <h1>
                                            <FontAwesomeIcon icon={faPenToSquare} className="icon" />
                                            Basic Information
                                        </h1>
                                    </div>
                                    <div className="input_gorup_layout">
                                        <div className="input_gorup">
                                            <label htmlFor="placeName" className="lb">
                                                Place name <sup>*</sup>
                                            </label>
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="placeName"
                                                    className="form_input"
                                                    id="placeName"
                                                    placeholder="e.g.., Sigiriya Rock Fortress"
                                                    value={data.place_name}
                                                    onChange={(e) => setData('place_name', e.target.value)}
                                                />
                                                <FontAwesomeIcon icon={faSignature} className="icon" />
                                                <span
                                                    className={`count ${data.place_name.length > 100 ? 'error' : data.place_name.length < 5 ? 'warning' : ''}`}
                                                >{`${data.place_name.length}/100`}</span>
                                            </div>
                                            {errors.place_name && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.place_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="input_gorup">
                                            <label htmlFor="category" className="lb">
                                                Categorys <sup>*</sup>
                                            </label>
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="category"
                                                    className="form_input drop"
                                                    id="placeName"
                                                    placeholder="Select Category"
                                                    readOnly={true}
                                                    onClick={() => {
                                                        dropDown.category
                                                            ? setDropDown({ ...dropDown, category: false })
                                                            : setDropDown({ ...dropDown, category: true });
                                                    }}
                                                    value={category.find((cat) => data.category_id == cat.id)?.category_name || ''}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faAngleDown}
                                                    className="seleter"
                                                    style={{ rotate: `${dropDown.category ? '180deg' : '0deg'}` }}
                                                />
                                                {dropDown.category && (
                                                    <ul className="selector">
                                                        {category.length <= 0 && (
                                                            <li
                                                                onClick={() => setDropDown({ ...dropDown, category: false })}
                                                                style={{ color: 'red' }}
                                                            >
                                                                First List Youre Category
                                                            </li>
                                                        )}
                                                        {category.map((cat) => (
                                                            <li
                                                                key={cat.id}
                                                                onClick={() => {
                                                                    setData('category_id', cat.id);
                                                                    setDropDown({ ...dropDown, category: false });
                                                                }}
                                                            >
                                                                {cat.category_name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            {errors.category_id && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.category_id}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="input_gorup_layout">
                                        <div className="input_gorup">
                                            <label htmlFor="searchTag" className="lb">
                                                Search Tag <sup>*</sup>
                                            </label>
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="searchTag"
                                                    className="form_input"
                                                    id="searchTag"
                                                    onChange={(e) => setData('search_tags', e.target.value)}
                                                    value={data.search_tags}
                                                    placeholder="e.g.., #Temple  #Hiking"
                                                />
                                                <FontAwesomeIcon icon={faTag} className="icon" />
                                            </div>
                                            {errors.search_tags && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.search_tags}
                                                </span>
                                            )}
                                        </div>
                                        <div className="input_gorup">
                                            <label htmlFor="subCategory" className="lb">
                                                Sub Categorys <sup>*</sup>
                                            </label>
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="subCategory"
                                                    className="form_input drop"
                                                    id="subCategory"
                                                    placeholder="Select Category"
                                                    readOnly={true}
                                                    onClick={() => {
                                                        dropDown.subCategory
                                                            ? setDropDown({ ...dropDown, subCategory: false })
                                                            : setDropDown({ ...dropDown, subCategory: true });
                                                    }}
                                                    value={
                                                        currentSubCategories.find((cat) => data.sub_category_id == cat.id)?.sub_category_name || ''
                                                    }
                                                />
                                                <FontAwesomeIcon
                                                    icon={faAngleDown}
                                                    className="seleter"
                                                    style={{ rotate: `${dropDown.subCategory ? '180deg' : '0deg'}` }}
                                                />
                                                {dropDown.subCategory && (
                                                    <ul className="selector">
                                                        {currentSubCategories.length <= 0 && (
                                                            <li
                                                                style={{ color: 'red' }}
                                                                onClick={() => setDropDown({ ...dropDown, subCategory: false })}
                                                            >
                                                                Select Category first!
                                                            </li>
                                                        )}
                                                        {currentSubCategories.map((cat) => (
                                                            <li
                                                                key={cat.id}
                                                                onClick={() => {
                                                                    setData('sub_category_id', cat.id);
                                                                    setDropDown({ ...dropDown, subCategory: false });
                                                                }}
                                                            >
                                                                {cat.sub_category_name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            {errors.sub_category_id && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.sub_category_id}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="back_apire"
                                    ref={(el) => {
                                        sectionRefs.current[1] = el;
                                    }}
                                >
                                    <div className="form_content_hedder sub">
                                        <h1>
                                            <FontAwesomeIcon icon={faFileZipper} className="icon" />
                                            Content & Descriptions
                                        </h1>
                                    </div>
                                    <div className="input_group">
                                        <label htmlFor="discription" className="lb">
                                            Description <sup>*</sup>
                                        </label>
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
                                            <span
                                                className={`count ${pureCharCount > 5000 ? 'error' : pureCharCount < 100 ? 'warning' : ''}`}
                                            >{`${pureCharCount}/5000`}</span>
                                        </div>
                                        {errors.description && (
                                            <span className="error" style={{ marginTop: '10px' }}>
                                                <FontAwesomeIcon icon={faExclamationCircle} />
                                                {errors.description}
                                            </span>
                                        )}
                                    </div>
                                    <div className="input_gorup">
                                        <label htmlFor="sDescription" className="lb">
                                            Short Description <sup>*</sup>
                                        </label>
                                        <div className="input_box">
                                            <textarea
                                                name="sDescription"
                                                id="sDescription"
                                                className="text_box"
                                                rows={8}
                                                onChange={(e) => setData('short_description', e.target.value)}
                                                value={data.short_description}
                                            ></textarea>
                                            <span
                                                className={`count ${data.short_description.length > 400 ? 'error' : data.short_description.length < 20 ? 'warning' : ''}`}
                                            >{`${data.short_description.length}/400`}</span>
                                        </div>
                                        {errors.short_description && (
                                            <span className="error">
                                                <FontAwesomeIcon icon={faExclamationCircle} />
                                                {errors.short_description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div
                                    className="back_apire"
                                    ref={(el) => {
                                        sectionRefs.current[2] = el;
                                    }}
                                >
                                    <div className="form_content_hedder sub">
                                        <h1>
                                            <FontAwesomeIcon icon={faMapLocation} className="icon" />
                                            Location & Contact
                                        </h1>
                                    </div>
                                    <div className="input_gorup_layout">
                                        <div className="input_gorup">
                                            <label htmlFor="address" className="lb">
                                                Address <sup>*</sup>
                                            </label>
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    className="form_input"
                                                    id="address"
                                                    placeholder="e.g.., Sigiriya rod dambulla"
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    value={data.address}
                                                />
                                                <FontAwesomeIcon icon={faLocationDot} className="icon" />
                                                <span
                                                    className={`count ${data.address.length > 250 ? 'error' : data.address.length < 20 ? 'warning' : ''}`}
                                                >{`${data.address.length}/250`}</span>
                                            </div>
                                            {errors.address && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.address}
                                                </span>
                                            )}
                                        </div>
                                        <div className="input_gorup">
                                            <div className="input_row_group">
                                                <div className="input_gorup">
                                                    <label htmlFor="latitude" className="lb">
                                                        Latitude <sup>*</sup>
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="number"
                                                            name="latitude"
                                                            className="form_input normal"
                                                            id="latitude"
                                                            placeholder="-8.409518"
                                                            onChange={(e) => setData('latitude', Number(e.target.value))}
                                                            step={'any'}
                                                            value={data.latitude || ''}
                                                        />
                                                    </div>
                                                    {errors.latitude && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.latitude}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="input_gorup">
                                                    <label htmlFor="longitude" className="lb">
                                                        Longitude <sup>*</sup>
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="number"
                                                            name="longitude"
                                                            className="form_input normal"
                                                            id="longitude"
                                                            placeholder="11.185732"
                                                            onChange={(e) => setData('longitude', Number(e.target.value))}
                                                            value={data.longitude || ''}
                                                        />
                                                    </div>
                                                    {errors.longitude && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.longitude}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input_gorup_layout">
                                        <div className="input_gorup">
                                            <label htmlFor="contact" className="lb">
                                                Contact Number
                                            </label>
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="contact"
                                                    className="form_input"
                                                    id="contact"
                                                    placeholder="e.g.., 011 122 2323"
                                                    onChange={(e) => setData('contact_number', e.target.value)}
                                                    value={data.contact_number}
                                                />
                                                <FontAwesomeIcon icon={faPhone} className="icon" />
                                            </div>
                                            {errors.contact_number && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.contact_number}
                                                </span>
                                            )}
                                        </div>
                                        <div className="input_gorup">
                                            <label htmlFor="urlWeb" className="lb">
                                                Website Url
                                            </label>
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="urlWeb"
                                                    className="form_input"
                                                    id="urlWeb"
                                                    placeholder="e.g.., https:/sigiriya.lk"
                                                    value={data.website_url}
                                                    onChange={(e) => setData('website_url', e.target.value)}
                                                />
                                                <FontAwesomeIcon icon={faGlobe} className="icon" />
                                            </div>
                                            {errors.website_url && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.website_url}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="back_apire"
                                    ref={(el) => {
                                        sectionRefs.current[3] = el;
                                    }}
                                >
                                    <div className="form_content_hedder sub">
                                        <h1>
                                            <FontAwesomeIcon icon={faAt} className="icon" />
                                            Visiting Details & Prices
                                        </h1>
                                    </div>
                                    <div className="input_gorup_layout">
                                        <div className="input_row_group">
                                            <div className="input_gorup">
                                                <label htmlFor="lTicket" className="lb">
                                                    Estimated duration (mins) <sup>*</sup>
                                                </label>
                                                <div className="input_box">
                                                    <input
                                                        type="number"
                                                        name="eDuration"
                                                        className="form_input normal"
                                                        onChange={(e) => setData('estimated_duration', Number(e.target.value))}
                                                        value={data.estimated_duration || ''}
                                                        id="eDuration"
                                                        placeholder="90"
                                                    />
                                                </div>
                                                {errors.estimated_duration && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {errors.estimated_duration}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="input_gorup">
                                                <label htmlFor="base" className="lb">
                                                    Base Distance (KM) <sup>*</sup>
                                                </label>
                                                <div className="input_box">
                                                    <input
                                                        type="number"
                                                        name="base"
                                                        className="form_input normal"
                                                        onChange={(e) => setData('base_distance', Number(e.target.value))}
                                                        value={data.base_distance || ''}
                                                        id="base"
                                                        placeholder="10"
                                                    />
                                                </div>
                                                {errors.base_distance && (
                                                    <span className="error">
                                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                                        {errors.base_distance}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="input_gorup">
                                            <div className="input_row_group">
                                                <div className="input_gorup">
                                                    <label htmlFor="oTime" className="lb">
                                                        Opening time <sup>*</sup>
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="time"
                                                            name="oTime"
                                                            className="form_input normals"
                                                            id="oTime"
                                                            onChange={(e) => setData('opening_time', e.target.value)}
                                                            value={data.opening_time}
                                                            placeholder="-8.409518"
                                                        />
                                                    </div>
                                                    {errors.opening_time && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.opening_time}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="input_gorup">
                                                    <label htmlFor="cTime" className="lb">
                                                        Closing time <sup>*</sup>
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="time"
                                                            name="cTime"
                                                            className="form_input normals"
                                                            id="cTime"
                                                            onChange={(e) => setData('closing_time', e.target.value)}
                                                            value={data.closing_time}
                                                            placeholder="11.185732"
                                                        />
                                                    </div>
                                                    {errors.closing_time && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.closing_time}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input_gorup_layout">
                                        <div className="input_gorup">
                                            <div className="input_row_group">
                                                <div className="input_gorup">
                                                    <label htmlFor="lTicket" className="lb">
                                                        Local price (Rs)
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="number"
                                                            name="lTicket"
                                                            className="form_input normal"
                                                            id="lTicket"
                                                            placeholder="250"
                                                            onChange={(e) => setData('local_ticket_price', Number(e.target.value))}
                                                            value={data.local_ticket_price || ''}
                                                        />
                                                    </div>
                                                    {errors.local_ticket_price && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.local_ticket_price}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="input_gorup">
                                                    <label htmlFor="fTicket" className="lb">
                                                        Foreign price (Rs)
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="number"
                                                            name="fTicket"
                                                            className="form_input normal"
                                                            id="fTicket"
                                                            placeholder="1000"
                                                            onChange={(e) => setData('foreign_ticket_price', Number(e.target.value))}
                                                            value={data.foreign_ticket_price || ''}
                                                        />
                                                    </div>
                                                    {errors.foreign_ticket_price && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.foreign_ticket_price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input_gorup">
                                            <div className="input_row_group">
                                                <div className="input_gorup">
                                                    <label htmlFor="bVTime" className="lb">
                                                        Best visit time
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="time"
                                                            name="bVTime"
                                                            className="form_input normals"
                                                            id="bVTime"
                                                            onChange={(e) => setData('best_visit_time', e.target.value)}
                                                            value={data.best_visit_time}
                                                        />
                                                    </div>
                                                    {errors.best_visit_time && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.best_visit_time}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="input_gorup">
                                                    <label htmlFor="cTime" className="lb">
                                                        Crowd level
                                                    </label>
                                                    <div className="input_box">
                                                        <input
                                                            type="text"
                                                            name="category"
                                                            className="form_input normal"
                                                            style={{ cursor: 'pointer' }}
                                                            id="placeName"
                                                            placeholder="Medium"
                                                            readOnly={true}
                                                            value={data.crowd_level}
                                                            onClick={() => {
                                                                dropDown.crowd
                                                                    ? setDropDown({ ...dropDown, crowd: false })
                                                                    : setDropDown({ ...dropDown, crowd: true });
                                                            }}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faAngleDown}
                                                            className="seleter"
                                                            style={{ rotate: `${dropDown.crowd ? '180deg' : '0deg'}` }}
                                                        />
                                                        {dropDown.crowd && (
                                                            <ul className="selector">
                                                                {crowdStatus.map((st) => (
                                                                    <li
                                                                        key={st}
                                                                        onClick={() => {
                                                                            setData('crowd_level', st);
                                                                            setDropDown({ ...dropDown, crowd: false });
                                                                        }}
                                                                    >
                                                                        {st}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                    {errors.crowd_level && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.crowd_level}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="back_apire"
                                    ref={(el) => {
                                        sectionRefs.current[4] = el;
                                    }}
                                >
                                    <div className="form_content_hedder sub">
                                        <h1>
                                            <FontAwesomeIcon icon={faClapperboard} className="icon" />
                                            Media Uploads
                                        </h1>
                                    </div>
                                    <div className="input_gorup_layout">
                                        <div className="input_gorup">
                                            <div className="input_row_group">
                                                <div className="input_gorup">
                                                    <span className="lb">
                                                        Place Main Image <sup>*</sup>
                                                    </span>
                                                    <div className="input_box">
                                                        <div className="fack_input_box">
                                                            <span className="choose_message">
                                                                {`${imagePreview.mainImage ? 1 : 0}/1`} File selected
                                                            </span>
                                                            <label htmlFor="main_image" className="input_image">
                                                                Browse
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id="main_image"
                                                                style={{ display: 'none' }}
                                                                onChange={handelMainImageChange}
                                                                accept="image/*"
                                                                max={1}
                                                            />
                                                        </div>
                                                    </div>
                                                    {errors.main_image_path && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.main_image_path}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="input_gorup">
                                                    <span className="lb">
                                                        Place Vedio <sup></sup>
                                                    </span>
                                                    <div className="input_box">
                                                        <div className="fack_input_box">
                                                            <span className="choose_message">{`${imagePreview.vedio ? 1 : 0}/1`} File selected</span>
                                                            <label htmlFor="video" className="input_image">
                                                                Browse
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id="video"
                                                                style={{ display: 'none' }}
                                                                onChange={handelMediaChange}
                                                                accept="video/*"
                                                                ref={videoInputRef}
                                                            />
                                                        </div>
                                                    </div>
                                                    {errors.media_path && (
                                                        <span className="error">
                                                            <FontAwesomeIcon icon={faExclamationCircle} />
                                                            {errors.media_path}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="input_gorup">
                                            <span className="lb">
                                                Place Other Image <sup></sup>
                                            </span>
                                            <div className="input_box">
                                                <div className="fack_input_box">
                                                    <span className="choose_message">
                                                        {`${imagePreview.otherImage ? imagePreview.otherImage.length : 0}/4`} File selected
                                                    </span>
                                                    <label htmlFor="other_image" className="input_image">
                                                        Browse
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="other_image"
                                                        style={{ display: 'none' }}
                                                        onChange={handelMediaChange}
                                                        multiple
                                                        accept="image/*"
                                                    />
                                                </div>
                                            </div>
                                            {errors.media_path && (
                                                <span className="error">
                                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                                    {errors.media_path}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {(imagePreview.mainImage !== '' ||
                                        imagePreview.otherImage.length > 0 ||
                                        imagePreview.vedio ||
                                        placeData.main_image_path ||
                                        placeData.media) && (
                                        <div className="place_image_privew_layout">
                                            <div className="main">
                                                <div className="input_gorup">
                                                    {imagePreview.mainImage && (
                                                        <>
                                                            <span className="lb">Main Image Preview</span>
                                                            <div className="main_image">
                                                                <FontAwesomeIcon
                                                                    icon={faTrashCan}
                                                                    className="icon"
                                                                    onClick={() => {
                                                                        setData('main_image_path', '');
                                                                        setImagePreview({ ...imagePreview, mainImage: '' });
                                                                    }}
                                                                />
                                                                <img src={imagePreview.mainImage} alt="main Image" />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="input_gorup">
                                                    {imagePreview.vedio && (
                                                        <>
                                                            <span className="lb">Video Preview</span>
                                                            <div className="main_image">
                                                                <FontAwesomeIcon icon={faTrashCan} className="icon" onClick={removeVideo} />
                                                                <video key={imagePreview.vedio.url} controls>
                                                                    <source src={imagePreview.vedio.url} type="video/mp4" />
                                                                </video>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="input_gorup">
                                                {imagePreview.otherImage.length > 0 && (
                                                    <>
                                                        <span className="lb">Video Preview</span>
                                                        <div className="other">
                                                            <div className="other_image_box">
                                                                {imagePreview.otherImage.map((item, index) => (
                                                                    <div className="holder_image" key={index}>
                                                                        <FontAwesomeIcon
                                                                            icon={faTrashCan}
                                                                            className="icon"

                                                                            onClick={() => removeOtherImage(index, item.id)}
                                                                        />
                                                                        
                                                                        <img src={item.url} alt="Other Image" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="back_apire sub">
                                    <div className="save_data">
                                        <div className="button_group">
                                            <Link className="btn sub" style={{ textDecoration: 'none' }} href={'/admin/manage-place'}>
                                                <FontAwesomeIcon icon={faAngleLeft} className="icon" />
                                                Back to page
                                            </Link>
                                            <button className="btn">
                                                <FontAwesomeIcon icon={faFloppyDisk} className="icon" />
                                                Save Change
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="holder">
                                <div className="right_content">
                                    <div className="complte_ratio">
                                        <span>Complete Ratio</span>

                                        <div className="ratio_content_holder">
                                            <div className="ratio_holder">
                                                <div className="ratio" style={{ width: `${completeRatio}%` }}></div>
                                            </div>
                                            <div className="presentage">{completeRatio}%</div>
                                        </div>
                                    </div>
                                    <div className="required_main">
                                        <span className="main_text">Required Fields</span>
                                        <ul className="request_list">
                                            <li
                                                onClick={() => {
                                                    handleNavClick('basic', 0);
                                                }}
                                            >
                                                <span className={`data ${validate.basic ? 'complet' : ''}`}>
                                                    <FontAwesomeIcon icon={faAngleDown} className={`icons ${validate.basic ? 'complet' : ''}`} />
                                                    Basic Information
                                                </span>
                                            </li>

                                            <li
                                                onClick={() => {
                                                    handleNavClick('content', 1);
                                                }}
                                            >
                                                <span className={`data ${validate.conent ? 'complet' : ''}`}>
                                                    <FontAwesomeIcon icon={faAngleDown} className={`icons ${validate.conent ? 'complet' : ''}`} />
                                                    Content & Descriptions
                                                </span>
                                            </li>

                                            <li
                                                onClick={() => {
                                                    handleNavClick('location', 2);
                                                }}
                                            >
                                                <span className={`data ${validate.location ? 'complet' : ''}`}>
                                                    <FontAwesomeIcon icon={faAngleDown} className={`icons ${validate.location ? 'complet' : ''}`} />
                                                    Location & Contact
                                                </span>
                                            </li>

                                            <li
                                                onClick={() => {
                                                    handleNavClick('visiting', 3);
                                                }}
                                            >
                                                <span className={`data ${validate.visiting ? 'complet' : ''}`}>
                                                    <FontAwesomeIcon icon={faAngleDown} className={`icons ${validate.visiting ? 'complet' : ''}`} />
                                                    Visiting Details & Prices
                                                </span>
                                            </li>

                                            <li
                                                onClick={() => {
                                                    handleNavClick('media', 4);
                                                }}
                                            >
                                                <span className={`data ${validate.media ? 'complet' : ''}`}>
                                                    <FontAwesomeIcon icon={faAngleDown} className={`icons ${validate.media ? 'complet' : ''}`} />
                                                    Media Uploads
                                                </span>
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
                                                    {data.main_image_path ? (
                                                        <img src={imagePreview.mainImage} alt={data.place_name || 'Preview'} className="card-image" />
                                                    ) : (
                                                        <div className="image-placeholder">
                                                            <FontAwesomeIcon icon={faImage} className="placeholder-icon" />
                                                            <span className="placeholder-text">Image Preview</span>
                                                        </div>
                                                    )}
                                                    <span className="card-category">
                                                        {data.category_id ? `Category ${data.category_id}` : 'Category'}
                                                    </span>
                                                </div>

                                                <div className="card-content-section">
                                                    <h5 className="card-title truncate">{data.place_name || 'Your Destination Name'}</h5>

                                                    <div className="card-location">
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                                                        <span className="location-text truncate">{data.address || 'Location Address'}</span>
                                                    </div>

                                                    <p className="card-description line-clamp-2">
                                                        {data.short_description ||
                                                            'A brief, catchy description of the place will appear here. Try to keep it under 160 characters.'}
                                                    </p>

                                                    <div className="card-meta-data">
                                                        <div className="meta-item">
                                                            <FontAwesomeIcon icon={faClock} className="meta-icon" />
                                                            <span>{data.estimated_duration || 'Duration'}</span>
                                                        </div>
                                                        <div className="meta-item">
                                                            <FontAwesomeIcon icon={faUsers} className="meta-icon" />
                                                            <span>{data.crowd_level || 'Crowd'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="card-footer">
                                                        <div className="price-label">Starting From</div>
                                                        <div className="card-price">
                                                            <span className="currency">LKR</span>
                                                            <span className="amount">{formatPrice(data.local_ticket_price)}</span>
                                                            <span className="per-person">/ person</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </main>
                </section>
            </div>
        </section>
    );
};

export default EditePlace;
