
"use client";

import React, { useEffect, useState } from "react";
import PageBanner from "utils/PageBanner";
import Image from "next/image";
import { TiTick } from "react-icons/ti";
import Link from "next/link";
import Title from "utils/Title";
import { motion } from "framer-motion";
import { fadeIn } from "app/variants";

import { SummeryApi } from "app/common/SummeryApi";
import Axios from "utils/Axios";
import AxiosToastError from "utils/AxiosToastError";

// Keyword-based bullet points
interface TransportBullet {
    keyword: string;
    text: string;
}

interface TransportBody {
    title1?: string;
    title2?: string;
    paragraph1?: string;
    paragraph2?: string;
    bullet_points?: TransportBullet[];
}

interface TransportItem {
    id: string;
    pageKey: string;
    section: string | null;
    title: string;
    slug: string | null;
    body: TransportBody;
    images: string[];
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

type RawTransportItem =
    Omit<TransportItem, "body" | "images"> & {
        body: unknown;
        images: unknown;
    };

// Safely parse CMS body data
function parseBody(body: unknown): TransportBody {
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

    const bullet_points: TransportBullet[] = Array.isArray(
        value.bullet_points
    )
        ? value.bullet_points
              .map((bullet: unknown): TransportBullet => {
                  // Support simple string bullet points
                  if (typeof bullet === "string") {
                      return {
                          keyword: "",
                          text: bullet,
                      };
                  }

                  // Support keyword-based bullet points
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
        bullet_points,
    };
}

// Handle Cloudinary image URLs stored as strings or objects
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
        .filter((url): url is string => Boolean(url));
}

const AssistInTransport = () => {
    const [
        assist_in_transport,
        setAssistInTransport,
    ] = useState<TransportItem[]>([]);

    const fetchAssistInTransport = async () => {
        try {
            const response = await Axios({
                ...SummeryApi.getContent,
                params: {
                    pageKey: "assist_in_transport",
                },
            });

            const result = response.data;

            const success =
                result?.success === true ||
                result?.error === false;

            if (!success) {
                return;
            }

            const data: RawTransportItem[] =
                Array.isArray(result?.data)
                    ? result.data
                    : [];

            // Display only published sections in admin-defined order
            const publishedContent = data
                .filter(
                    (item) =>
                        item.pageKey === "assist_in_transport" &&
                        item.isPublished
                )
                .map((item) => ({
                    ...item,
                    body: parseBody(item.body),
                    images: parseImages(item.images),
                }))
                .sort((a, b) => a.order - b.order);

            setAssistInTransport(publishedContent);
        } catch (error) {
            AxiosToastError(error);
        }
    };

    useEffect(() => {
        void fetchAssistInTransport();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center w-full h-full ">
            <PageBanner
                title="Assist In Transport"
                path="/assist-in-transport"
            />

            <div className="container px-5 flex flex-col items-center mx-auto justify-center w-full h-full ">
                <div className="grid w-full gap-10 h-full">
                    {assist_in_transport.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex flex-col gap-x-6 ${
                                [0, 2, 4].includes(index)
                                    ? "md:flex-row-reverse"
                                    : "md:flex-row"
                            } justify-start items-start w-full`}
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
                                        className="hover:scale-102 ease-in-out transition-all duration-500  w-full h-full md:object-center rounded-md inset-0 items-start justify-start p-0 m-0 "
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
                                className="flex flex-col w-full  justify-start gap-2    "
                            >
                                <Title
                                    title1={item.body.title1 || ""}
                                    title2={item.body.title2 || ""}
                                />

                                <p className=" flex w-full text-lg text-secondary-text font-medium  ">
                                    {item.body.paragraph1}
                                </p>

                                <ul className="grid gap-2">
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
                        Connect with Us Today!
                    </h2>

                    <div className="w-14 h-0.75 bg-primary items-center  " />

                    <p className=" text-lg text-secondary-text font-medium text-center ">
                        <a
                            className="text-blue-600"
                            href="tel:0481 707 758"
                        >
                            Call now
                        </a>
                        to book an appointment to learn more about how our
                        experts can help you live independently and offer
                        safe transport assistance. If you have any further
                        queries, you can send an email, and we will reply
                        to you soon.
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

export default AssistInTransport;
