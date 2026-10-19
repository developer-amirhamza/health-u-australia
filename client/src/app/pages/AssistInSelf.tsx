
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageBanner from "utils/PageBanner";
import Image from "next/image";
import { TiTick } from "react-icons/ti";
import Link from "next/link";
import Title from "utils/Title";
import { fadeIn } from "app/variants";

import { SummeryApi } from "app/common/SummeryApi";
import Axios from "utils/Axios";
import AxiosToastError from "utils/AxiosToastError";

// Bullet points used by Assist in Self-Care
interface SelfCareBullet {
    keyword: string;
    text: string;
}

interface SelfCareBody {
    title1?: string;
    title2?: string;
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
    bullet_title?: string;
    bullet_points?: SelfCareBullet[];
}

interface SelfCareItem {
    id: string;
    pageKey: string;
    section: string | null;
    title: string;
    slug: string | null;
    body: SelfCareBody;
    images: string[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

type RawSelfCareItem =
    Omit<SelfCareItem, "body" | "images"> & {
        body: unknown;
        images: unknown;
    };

// Safely parse content saved by the admin CMS
function parseBody(body: unknown): SelfCareBody {
    let parsed: unknown = body;

    if (typeof parsed === "string") {
        try {
            parsed = JSON.parse(parsed);
        } catch {
            return {};
        }
    }

    if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
    ) {
        return {};
    }

    const value = parsed as Record<string, unknown>;

    const bullet_points: SelfCareBullet[] = Array.isArray(
        value.bullet_points
    )
        ? value.bullet_points
              .map((bullet: unknown): SelfCareBullet => {
                  if (typeof bullet === "string") {
                      return {
                          keyword: "",
                          text: bullet,
                      };
                  }

                  if (
                      bullet &&
                      typeof bullet === "object" &&
                      !Array.isArray(bullet)
                  ) {
                      const item = bullet as Record<string, unknown>;

                      return {
                          keyword:
                              typeof item.keyword === "string"
                                  ? item.keyword
                                  : "",
                          text:
                              typeof item.text === "string"
                                  ? item.text
                                  : "",
                      };
                  }

                  return {
                      keyword: "",
                      text: "",
                  };
              })
              .filter(
                  (bullet) => bullet.keyword || bullet.text
              )
        : [];

    return {
        title1:
            typeof value.title1 === "string"
                ? value.title1
                : "",
        title2:
            typeof value.title2 === "string"
                ? value.title2
                : "",
        paragraph1:
            typeof value.paragraph1 === "string"
                ? value.paragraph1
                : "",
        paragraph2:
            typeof value.paragraph2 === "string"
                ? value.paragraph2
                : "",
        paragraph3:
            typeof value.paragraph3 === "string"
                ? value.paragraph3
                : "",
        bullet_title:
            typeof value.bullet_title === "string"
                ? value.bullet_title
                : "",
        bullet_points,
    };
}

// Support Cloudinary images saved as strings or objects
function parseImages(images: unknown): string[] {
    if (!Array.isArray(images)) {
        return [];
    }

    return images
        .map((image: unknown) => {
            if (typeof image === "string") {
                return image;
            }

            if (
                image &&
                typeof image === "object" &&
                !Array.isArray(image)
            ) {
                const item = image as Record<string, unknown>;

                if (typeof item.secure_url === "string") {
                    return item.secure_url;
                }

                if (typeof item.url === "string") {
                    return item.url;
                }
            }

            return "";
        })
        .filter(
            (url): url is string => Boolean(url)
        );
}

const AssistInSelf = () => {
    const [
        assist_in_self_care,
        setAssistInSelfCare,
    ] = useState<SelfCareItem[]>([]);

    const fetchAssistInSelfCare = async () => {
        try {
            const response = await Axios({
                ...SummeryApi.getContent,
                params: {
                    pageKey: "assist_in_self_care",
                },
            });

            const result = response.data;

            const success =
                result?.success === true ||
                result?.error === false;

            if (!success) {
                return;
            }

            const data: RawSelfCareItem[] =
                Array.isArray(result?.data)
                    ? result.data
                    : [];

            const publishedContent = data
                .filter(
                    (item) =>
                        item.pageKey === "assist_in_self_care" &&
                        item.isPublished
                )
                .map((item) => ({
                    ...item,
                    body: parseBody(item.body),
                    images: parseImages(item.images),
                }))
                .sort((a, b) => a.order - b.order);

            setAssistInSelfCare(publishedContent);
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        void fetchAssistInSelfCare();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner
                title="Assist In Self Care"
                path="/assist-in-self-care"
            />

            <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <div className="grid gap-8 w-full h-full ">
                    {assist_in_self_care.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex flex-col gap-6 ${
                                [0, 2, 4].includes(index)
                                    ? "md:flex-row-reverse"
                                    : "md:flex-row"
                            } justify-center items-start w-full`}
                        >
                            <motion.div
                                variants={fadeIn(
                                    [0, 2, 4].includes(index)
                                        ? "right"
                                        : "left",
                                    0.2
                                )}
                                initial="hidden"
                                whileInView={"show"}
                                className="flex w-full h-full"
                            >
                                {item.images[0] && (
                                    <Image
                                        src={item.images[0]}
                                        alt="about heath u australia"
                                        width={500}
                                        height={520}
                                        className="hover:scale-102 rounded-md flex ease-in-out transition-all duration-500  w-full h-full md:object-center inset-0 items-start justify-start p-0 m-0 "
                                    />
                                )}
                            </motion.div>

                            <motion.div
                                variants={fadeIn(
                                    [0, 2, 4].includes(index)
                                        ? "left"
                                        : "right",
                                    0.2
                                )}
                                initial="hidden"
                                whileInView={"show"}
                                className="flex flex-col w-full justify-center gap-2"
                            >
                                <Title
                                    title1={item.body.title1 || ""}
                                    title2={item.body.title2 || ""}
                                />

                                <p className=" flex w-full text-lg text-secondary-text font-medium  ">
                                    {item.body.paragraph1}
                                </p>

                                <ul className="grid gap-2">
                                    {item.body.bullet_title && (
                                        <h4 className="text-xl my-3 text-secondary-text font-semibold">
                                            {item.body.bullet_title}{" "}
                                        </h4>
                                    )}

                                    {item.body.bullet_points?.map(
                                        (itm, idx) => (
                                            <li
                                                key={idx}
                                                className=" flex items-start w-full gap-2 "
                                            >
                                                <TiTick className="bg-secondary rounded-full text-4xl  h-full w-full max-h-5 max-w-5 mt-0.5 text-white " />

                                                <p className="text-lg font-medium text-secondary-text ">
                                                    <strong>
                                                        {itm.keyword}{" "}
                                                    </strong>
                                                    {itm.text}
                                                </p>
                                            </li>
                                        )
                                    )}

                                    <p className="text-lg text-secondary-text font-medium my-2">
                                        {item.body.paragraph2}{" "}
                                    </p>
                                </ul>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <motion.div
                    variants={fadeIn("up", 0.2)}
                    initial="hidden"
                    whileInView={"show"}
                    className="flex flex-col w-full justify-center gap-4 h-full items-center bg-gray-100 p-10    "
                >
                    <h2 className="text-3xl font-bold  ">
                        We’re Simply Here To Help You – Enquire NOW
                    </h2>

                    <div className="w-14 h-0.75 bg-primary items-center  " />

                    <p className=" text-lg text-secondary-text font-medium text-center ">
                        Contact us today to discuss your personal care
                        needs and find out how we can help you live more
                        comfortably.
                        <a
                            className="text-blue-600"
                            href="tel:0481 707 758"
                        >
                            Call us
                        </a>{" "}
                        directly or email us with your requirements.
                    </p>

                    <div className="flex items-center justify-center gap-10">
                        <Link
                            href={"/contact-us"}
                            className="text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 "
                        >
                            Enquire Now
                        </Link>

                        <Link
                            href={"/referral"}
                            className="text-white text-lg font-semibold px-9 py-3.5 rounded-full bg-primary hover:bg-secondary transition-colors duration-300 "
                        >
                            Referral
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AssistInSelf;
