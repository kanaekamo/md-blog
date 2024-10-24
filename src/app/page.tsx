import Header from './Header';
import Footer from './Footer';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Image from 'next/image';

export const useMakeString = (content: string, maxContentLength: number) => {
  if (content.length > maxContentLength) {
    return content.substring(0, maxContentLength) + "...";
  }
  return content;
};

export default async function Home() {
  const postsDirectory = path.join(process.cwd(), '/src/app/posts');
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug: fileName.replace('.md', ''),
        frontmatter: data,
      };
    })
  ).then((posts) =>
    posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date))
  );

  return (
    <div className="bg-red-700 min-h-screen">
      <Header />
      <main>
        <h1 className="pt-8 px-8 pb-4 text-white font-kablammo text-4xl">BLOG LIST</h1>
        <div>
          <div className="pb-16 px-12 text-white">
            {posts.map((post) => (
              <Link key={post.slug} href={`/${post.slug}`}>
                <div className='mb-4 p-4 bg-red-800 rounded-2xl hover:bg-red-500'>                
                  <div className='text-base'>{post.frontmatter.date}</div> 
                  <h2 className='font-mono font-bold text-2xl'>{post.frontmatter.title}</h2>
                  <div className='flex items-center'>
                    <Image
                      src={`/${post.frontmatter.image}`}
                      width={300}
                      height={200}
                      alt={post.frontmatter.title}
                    />
                    <p className='px-8 font-mono'>{post.frontmatter.beginning}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer  />
    </div>
  );
}