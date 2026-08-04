-- Demo rows use stable UUIDs and are clearly marked as sample content.
-- Create the matching demo auth user and profile before running this seed in a hosted project.
insert into public.businesses (id, owner_id, name, slug, category, description, cover_image_url, phone, whatsapp, instagram_url, address, latitude, longitude, opening_hours, theme, published)
values ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Malabar Bakes', 'malabar-bakes', 'Bakery and café', '[Sample data] Fresh Kerala inspired bakes and treats made in Kochi.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=85', '+91 98765 43210', '919876543210', 'https://www.instagram.com/', 'Sample location, Panampilly Nagar, Kochi, Kerala', 9.966700, 76.299900, '{"Mon":"8 AM – 9 PM","Tue":"8 AM – 9 PM","Wed":"8 AM – 9 PM","Thu":"8 AM – 9 PM","Fri":"8 AM – 10 PM","Sat":"8 AM – 10 PM","Sun":"9 AM – 9 PM"}', 'cafe', true)
on conflict (id) do nothing;

insert into public.products (id, business_id, name, description, price, currency, category, image_url, tags, available, sort_order)
values
('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000101', 'Cardamom Bun', '[Sample data] A soft, golden bun finished with fragrant cardamom sugar.', 90, 'INR', 'Sweet bakes', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85', array['baked fresh','tea time'], true, 1),
('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000101', 'Malabar Veg Puff', '[Sample data] Flaky pastry with a warmly spiced vegetable filling.', 65, 'INR', 'Savouries', 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=900&q=85', array['savoury','quick bite'], true, 2),
('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000101', 'Coconut Tea Cake', '[Sample data] A tender loaf cake with a toasted coconut finish.', 280, 'INR', 'Cakes', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85', array['small batch','sharing'], true, 3)
on conflict (id) do nothing;
