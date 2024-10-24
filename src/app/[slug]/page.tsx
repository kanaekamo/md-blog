import Footer from "../Footer";
import Header from "../Header";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import './content.css';
import Image from 'next/image';

export default async function BlogPost({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), '/src/app/posts', `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const title = data.title;
  const processedContent = await unified().use(remarkParse).use(remarkHtml).process(content);
  const contentHtml = processedContent.toString();
  const saunier = data.image
  const postdate = data.date

  return (
    <div className="bg-red-700 min-h-screen">
      <Header />
      <main>
        <div className='px-8 pt-8 text-bas text-white text-xl'>{postdate}</div> 
        <div className="pb-8 px-8 text-white font-mono text-4xl font-bold">{title}</div>
        <div className="px-8">
          <Image
            src={`/${saunier}`}
            width={800}
            height={500}
            alt={title}
          />
        </div>
        <div className="p-8 font-mono">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
        </div>
      </main>
      <Footer  />
    </div>
  );
}